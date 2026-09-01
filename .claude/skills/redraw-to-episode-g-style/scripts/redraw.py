#!/usr/bin/env python3
"""Redraw one image in a new art style via the Higgsfield CLI.

Usage:
  redraw.py <source_image> --prompt-file <txt> --out <dest.png>
            [--style-ref <img>]... [--model nano_banana_pro]
            [--aspect auto|<ratio>] [--resolution 2k] [--cost]

The source image is always the FIRST image reference; style refs follow.
Prints the local output path (or the cost estimate with --cost) to stdout.
Auth comes from the higgsfield CLI itself (`higgsfield auth login`).
"""
import argparse, json, shutil, subprocess, sys, time, urllib.request

ASPECTS = ['1:1', '3:2', '2:3', '4:3', '3:4', '4:5', '5:4', '9:16', '16:9', '21:9']
TRANSIENT = ('503', 'service unavailable', 'nsfw', 'timeout', 'temporarily')


def closest_aspect(path):
    from PIL import Image
    with Image.open(path) as im:
        w, h = im.size
    ratio = w / h
    return min(ASPECTS, key=lambda a: abs(ratio - int(a.split(':')[0]) / int(a.split(':')[1])))


def find_url(o):
    if isinstance(o, str) and o.startswith('http') and \
            any(o.lower().split('?')[0].endswith(e) for e in ('.png', '.jpg', '.jpeg', '.webp')):
        return o
    if isinstance(o, dict):
        for v in o.values():
            u = find_url(v)
            if u:
                return u
    if isinstance(o, list):
        for v in o:
            u = find_url(v)
            if u:
                return u
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source')
    ap.add_argument('--prompt-file', required=True)
    ap.add_argument('--out')
    ap.add_argument('--style-ref', action='append', default=[])
    ap.add_argument('--model', default='nano_banana_pro')
    ap.add_argument('--aspect', default='auto')
    ap.add_argument('--resolution', default='2k')
    ap.add_argument('--cost', action='store_true')
    args = ap.parse_args()
    if not args.cost and not args.out:
        ap.error('--out is required unless --cost')

    hf = shutil.which('higgsfield')
    if not hf:
        sys.exit('ERROR higgsfield CLI not found in PATH')

    prompt = open(args.prompt_file).read()
    aspect = closest_aspect(args.source) if args.aspect == 'auto' else args.aspect

    cmd = [hf, 'generate', ('cost' if args.cost else 'create'), args.model,
           '--prompt', prompt, '--aspect_ratio', aspect,
           '--resolution', args.resolution, '--json',
           '--image-references', args.source]
    for r in args.style_ref[:13]:  # source + 13 = 14-reference cap
        cmd += ['--image-references', r]
    if not args.cost:
        cmd += ['--wait', '--wait-timeout', '10m']

    if args.cost:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        print(res.stdout.strip() or res.stderr.strip())
        return

    out, err = '', ''
    for attempt in range(4):
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=900)
        out = (res.stdout or '').strip()
        err = (res.stderr or '').strip() + ' ' + out
        if res.returncode == 0 and out:
            break
        if any(t in err.lower() for t in TRANSIENT):
            time.sleep(4)
            continue
        sys.exit(f'ERROR {res.returncode} {err[:500]}')
    else:
        sys.exit(f'ERROR retries-exhausted {err[:300]}')

    try:
        url = find_url(json.loads(out))
    except Exception as e:
        sys.exit(f'PARSE_FAIL {e} {out[:400]}')
    if not url:
        sys.exit(f'NO_URL {out[:400]}')
    urllib.request.urlretrieve(url, args.out)
    print(args.out)


if __name__ == '__main__':
    main()
