#!/usr/bin/env python3
"""Publish a finished build-saint sheet into the site and archive its edit files.

    publish_build.py --staging <dir> --builds-root <dir> --originals-root <dir> \
        (--saint-id <id> | --image /cloth-schemes/<army>/<name>.jpg) [--dry-run]

Given the staging folder of one build (<staging>/<name>.jpg + <name>.xcf, where
<name> is the folder's basename):

1. writes the web copy public/cloth-schemes/<army>/<name>.jpg (height 400, Q92),
   replacing the saint's current image; a legacy non-.jpg image is removed and
   every saints.csv row pointing at it is repointed to the .jpg;
2. moves the saint's previous original out of <originals-root>/<army>/ into the
   staging folder as source-original.<ext>, then copies the full-size sheet JPG
   there as <name>.jpg (the archive always holds what the site shows);
3. moves the whole staging folder to <builds-root>/<army>/<name>/ so the XCF,
   parts and job files stay editable later.

It does not rebuild the JSON, test, commit, push or notify — the caller does,
once per batch. Prints one JSON line with what it did. Run from the repo root.
"""
import argparse
import csv
import io
import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path.cwd()
SAINTS = REPO / "csv/data/saints.csv"


def read_saints():
    raw = SAINTS.read_bytes().decode("utf-8-sig")
    rows = list(csv.reader(io.StringIO(raw)))
    return rows[0], rows[1:]


def write_saints(header, rows):
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(header)
    w.writerows(rows)
    SAINTS.write_bytes(("﻿" + buf.getvalue()).encode("utf-8"))


def folder_on(root, army):
    """The army folder that exists under root (Nextcloud names differ slightly)."""
    if (root / army).is_dir():
        return root / army
    aliases = {"silent-knight": "silent-knight-sho", "zeus-gods": "zeus-olympians"}
    alt = aliases.get(army)
    if alt and (root / alt).is_dir():
        return root / alt
    sys.exit(f"no folder for army '{army}' under {root} - create it on purpose, not by accident")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--staging", required=True, type=Path)
    ap.add_argument("--builds-root", required=True, type=Path)
    ap.add_argument("--originals-root", required=True, type=Path)
    who = ap.add_mutually_exclusive_group(required=True)
    who.add_argument("--saint-id")
    who.add_argument("--image", help="current site image path as in saints.csv")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if not SAINTS.exists():
        sys.exit("run from the saintseiyacloths repo root")
    staging = a.staging.expanduser().resolve()
    name = staging.name
    sheet, xcf = staging / f"{name}.jpg", staging / f"{name}.xcf"
    for f in (sheet, xcf):
        if not f.is_file():
            sys.exit(f"missing {f}")

    header, rows = read_saints()
    col = header.index("image")
    if a.saint_id:
        hit = [r for r in rows if r[0] == a.saint_id]
        if not hit:
            sys.exit(f"saint id {a.saint_id} not in saints.csv")
        old_image = hit[0][col]
    else:
        old_image = a.image
    parts = Path(old_image).parts  # ('/', 'cloth-schemes', army, file)
    if len(parts) != 4 or parts[1] != "cloth-schemes":
        sys.exit(f"unexpected image path {old_image}")
    army, stem = parts[2], Path(parts[3]).stem
    new_image = f"/cloth-schemes/{army}/{stem}.jpg"
    web = REPO / "public" / new_image.lstrip("/")
    old_web = REPO / "public" / old_image.lstrip("/")

    orig_dir = folder_on(a.originals_root.expanduser(), army)
    builds_dir = a.builds_root.expanduser() / orig_dir.name
    dest = builds_dir / name
    if dest.exists():
        sys.exit(f"{dest} already exists - already published?")
    old_originals = sorted(p for p in orig_dir.glob(f"{stem}.*") if p.is_file())

    report = {"dir": name, "image": new_image, "web": str(web), "archive": str(orig_dir / f"{stem}.jpg"),
              "builds": str(dest), "moved_originals": [p.name for p in old_originals],
              "repointed_rows": [r[0] for r in rows if r[col] == old_image and old_image != new_image]}
    if a.dry_run:
        print(json.dumps(report, ensure_ascii=False))
        return

    web.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["convert", str(sheet), "-background", "white", "-flatten", "-resize", "x400>",
                    "-quality", "92", str(web)], check=True)
    if old_web != web and old_web.exists():
        old_web.unlink()
    if report["repointed_rows"]:
        for r in rows:
            if r[col] == old_image:
                r[col] = new_image
        write_saints(header, rows)

    for i, p in enumerate(old_originals):
        suffix = "" if i == 0 else f"-{i + 1}"
        shutil.move(str(p), str(staging / f"source-original{suffix}{p.suffix}"))
    shutil.copy2(sheet, orig_dir / f"{stem}.jpg")

    builds_dir.mkdir(parents=True, exist_ok=True)
    shutil.move(str(staging), str(dest))
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
