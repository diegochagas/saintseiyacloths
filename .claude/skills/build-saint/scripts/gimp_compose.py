# GIMP 3 batch script: compose a Saint Seiya cloth-scheme sheet from the
# templates in templates/cloth-scheme/ plus pre-generated art pieces.
#
# Runs INSIDE GIMP's python-fu-eval interpreter. Invoke as:
#   timeout 600 flatpak run --env=COMPOSE_JOB=/abs/job.json org.gimp.GIMP -id \
#     --batch-interpreter=python-fu-eval \
#     -b "exec(open('<skill>/scripts/gimp_compose.py').read())" --quit
#
# NOTE: -id, NOT -idf: fonts must be loaded so text layers can be edited.
#
# Job JSON:
# {
#   "template_dir": "/abs/templates/cloth-scheme",
#   "style": "classic",                       # key into manifest.json "backgrounds"
#   "canvas_width": 2400,                     # optional: scale the background to this
#                                             # width BEFORE composing, so small art
#                                             # pieces never need heavy upscaling; all
#                                             # coordinates below are in the scaled space
#   "texts": {"character": "ORION JAEGER",    # only roles the template has are used
#             "group": "SILVER SAINT",
#             "cloth": "ORION CLOTH"},
#   "images": [                               # armor object, character, etc.
#     {"path": "/abs/armor.png", "x": 100, "y": 300, "w": 1400}
#   ],
#   "armor_shadow": {                         # templates with a "shadow" layer (classic):
#     "path": "/abs/armor-t.png"              # its placeholder is replaced by an all-black
#   },                                        # silhouette of this image (alpha-knocked-out
#                                             # armor object), fitted to the same area
#   "insets": [                               # white circle + part draft centered on it;
#                                             # point_to = where the part sits on the
#                                             # knight/armor — the circle's tail is
#                                             # rotated to aim at it
#     {"path": "/abs/part-head.png", "cx": 2000, "cy": 500, "d": 700,
#      "point_to": [2600, 300]}
#   ],
#   "arrows": [                               # start (head end) at the circle, star end
#                                             # ON the armor-object part; label over blank
#                                             # background near the arrow
#     {"points": [[1500, 400], [1800, 500]], "label": "HEAD",
#      "size": 60, "label_size": 40, "label_pos": [1450, 330]}
#   ],
#   "out_xcf": "/abs/out.xcf",                # saved LAYERED (editable in GIMP)
#   "out_jpg": "/abs/out.jpg",                # flattened
#   "preview": "/abs/preview.png"
# }

import json
import math
import os
import re
import traceback

import gi
gi.require_version('Gimp', '3.0')
from gi.repository import Gimp, Gio, Gegl

JOB_PATH = os.environ['COMPOSE_JOB']
LOG_PATH = JOB_PATH + '.log'
_log = open(LOG_PATH, 'w')

WORD_JOINER = '⁠'


def log(msg):
    _log.write(str(msg) + '\n')
    _log.flush()


def load_image(path):
    return Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(path))


def clean_name(layer):
    return layer.get_name().replace(WORD_JOINER, '')


def replace_text(layer, new_text, size_pt=None):
    """Replace a text layer's content, preserving the original formatting.

    The templates carry formatting two ways: pango markup attributes
    (size/foreground/letter_spacing/b/i) and the layer's base font attributes.
    set_text/set_markup can reset the base attributes, so both are captured
    before and re-applied after. size_pt overrides the font size (markup
    size attributes win over set_font_size, so it must go into the markup).
    """
    markup = layer.get_markup() or ''
    font = layer.get_font()
    try:
        base_size, base_unit = layer.get_font_size()
    except (TypeError, ValueError):
        base_size, base_unit = None, None

    m_size = re.search(r'size="(\d+)"', markup)
    size_val = str(int(size_pt * 1024)) if size_pt else (m_size.group(1) if m_size else None)
    m_color = re.search(r'foreground="(#[0-9a-fA-F]{6})"', markup)
    m_spc = re.search(r'letter_spacing="(\d+)"', markup)
    # the REAL display font often lives in the markup (as a session font id),
    # not in the layer's base font — it MUST be carried over or the text
    # silently falls back to the base font
    m_font = re.search(r'font="([^"]+)"', markup)
    bold = '<b>' in markup
    italic = '<i>' in markup

    inner = (new_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
    if bold:
        inner = '<b>%s</b>' % inner
    if italic:
        inner = '<i>%s</i>' % inner
    attrs = ''
    if m_font and m_font.group(1):
        attrs += ' font="%s"' % m_font.group(1)
    if m_spc:
        attrs += ' letter_spacing="%s"' % m_spc.group(1)
    if size_val:
        attrs += ' size="%s"' % size_val
    if m_color:
        attrs += ' foreground="%s"' % m_color.group(1)
    if attrs or bold or italic:
        layer.set_markup('<markup><span%s>%s</span></markup>' % (attrs, inner)
                         if attrs else '<markup>%s</markup>' % inner)
    else:
        layer.set_text(new_text)

    if font is not None:
        layer.set_font(font)
    if size_pt:
        layer.set_font_size(size_pt, Gimp.Unit.point())
    elif base_size is not None and not m_size:
        layer.set_font_size(base_size, base_unit)


def import_layer(src_layer, dest_img, name=None):
    layer = Gimp.Layer.new_from_drawable(src_layer, dest_img)
    dest_img.insert_layer(layer, None, 0)
    if name:
        layer.set_name(name)
    return layer


def place_image(dest_img, path, x, y, w=None, h=None, name=None):
    src = load_image(path)
    # flatten() would drop alpha and fill transparent pixels with white —
    # merge_visible_layers keeps the alpha channel from -transparent knockouts.
    if len(src.get_layers()) > 1:
        src.merge_visible_layers(Gimp.MergeType.CLIP_TO_IMAGE)
    layer = import_layer(src.get_layers()[0], dest_img, name or os.path.basename(path))
    src.delete()
    lw, lh = layer.get_width(), layer.get_height()
    if w and not h:
        h = max(1, int(lh * w / lw))
    if h and not w:
        w = max(1, int(lw * h / lh))
    if w and h and (w != lw or h != lh):
        layer.scale(int(w), int(h), False)
    layer.set_offsets(int(x), int(y))
    return layer


def center_layer(layer, cx, cy):
    layer.set_offsets(int(cx - layer.get_width() / 2), int(cy - layer.get_height() / 2))


def draw_polyline(img, points, width=3.0):
    """Draw a black polyline by selecting thin quads and filling — needs no
    brushes, so it works with -d (no-data) startups too."""
    layer = Gimp.Layer.new(img, 'arrow-line', img.get_width(), img.get_height(),
                           Gimp.ImageType.RGBA_IMAGE, 100.0, Gimp.LayerMode.NORMAL)
    img.insert_layer(layer, None, 0)
    layer.fill(Gimp.FillType.TRANSPARENT)
    Gimp.context_set_foreground(Gegl.Color.new('#000000'))
    half = width / 2.0
    for (x1, y1), (x2, y2) in zip(points, points[1:]):
        dx, dy = x2 - x1, y2 - y1
        length = math.hypot(dx, dy) or 1.0
        # perpendicular offset
        px, py = -dy / length * half, dx / length * half
        # extend the segment ends by half so joints close
        ex, ey = dx / length * half, dy / length * half
        quad = [x1 - ex + px, y1 - ey + py,
                x2 + ex + px, y2 + ey + py,
                x2 + ex - px, y2 + ey - py,
                x1 - ex - px, y1 - ey - py]
        img.select_polygon(Gimp.ChannelOps.REPLACE, quad)
        layer.edit_fill(Gimp.FillType.FOREGROUND)
    Gimp.Selection.none(img)
    return layer


def main():
    with open(JOB_PATH) as f:
        job = json.load(f)

    tdir = job['template_dir']
    with open(os.path.join(tdir, 'manifest.json')) as f:
        manifest = json.load(f)

    bg_spec = manifest['backgrounds'][job['style']]
    img = load_image(os.path.join(tdir, bg_spec['file']))
    log('template %s loaded %dx%d' % (bg_spec['file'], img.get_width(), img.get_height()))
    base_type = img.get_base_type()
    if base_type != Gimp.ImageBaseType.RGB:
        # Indexed/Grayscale templates (classic, saintia-sho, lost-canvas) would
        # otherwise force every composited color layer into the background's
        # limited palette, turning the whole sheet grayscale.
        img.convert_rgb()
        log('template converted to RGB (was base_type %s)' % base_type)
    # 0. force a WHITE page: template scans often carry a light-gray paper
    # tone. Sample likely-blank spots on the bottom (background) layer and,
    # if the page is not white, pull its white point up so paper -> pure
    # white (art lines are barely affected).
    bg_layer = img.get_layers()[-1]
    w, h = bg_layer.get_width(), bg_layer.get_height()
    tone = 0.0
    for fx, fy in ((0.5, 0.5), (0.25, 0.5), (0.75, 0.5), (0.5, 0.25), (0.5, 0.75)):
        try:
            px = bg_layer.get_pixel(int(w * fx), int(h * fy))
            if isinstance(px, tuple):
                px = px[-1]
            r, g, b, _a = px.get_rgba()
            tone = max(tone, r, g, b)
        except Exception as e:
            log('WARN page-tone sample failed: %s' % e)
    if 0.5 < tone < 0.97:
        bg_layer.levels(Gimp.HistogramChannel.VALUE,
                        0.0, min(0.995, tone), False, 1.0, 0.0, 1.0, False)
        log('page whitened: paper tone %.3f -> white point' % tone)
    elif tone >= 0.97:
        log('page already white (tone %.3f)' % tone)

    # 1. text roles — BEFORE any canvas scaling: a scaled text layer keeps its
    # scaled raster and silently ignores set_markup/set_text
    texts = job.get('texts', {})
    replaced_layers = []
    for role, layer_name in bg_spec.get('text', {}).items():
        if role not in texts:
            continue
        target = None
        for layer in img.get_layers():
            if isinstance(layer, Gimp.TextLayer) and clean_name(layer) == layer_name.replace(WORD_JOINER, ''):
                target = layer
                break
        if target is None:
            log('WARN text layer for role %r (%r) not found' % (role, layer_name))
            continue
        replace_text(target, texts[role])
        log('text %s -> %r' % (role, texts[role]))
        replaced_layers.append(target)

    # Anti-collision nudge: a dynamic text layer's reported bounding box can
    # grow (usually downward, top offset unchanged) when the new string is
    # longer/shorter than the template's placeholder, even at the same font
    # size — this can push a title into the subtitle sitting right under it.
    # Detect actual rectangle overlaps among the layers we just edited (top
    # offset stays put, so sort by it) and push the lower one down clear.
    replaced_layers.sort(key=lambda l: l.get_offsets().offset_y)
    for upper, lower in zip(replaced_layers, replaced_layers[1:]):
        ux, uy = upper.get_offsets().offset_x, upper.get_offsets().offset_y
        uw, uh = upper.get_width(), upper.get_height()
        lx, ly = lower.get_offsets().offset_x, lower.get_offsets().offset_y
        lw, lh = lower.get_width(), lower.get_height()
        x_overlap = ux < lx + lw and lx < ux + uw
        overlap = (uy + uh) - ly
        if x_overlap and overlap > 0:
            pad = max(4, int(uh * 0.06))
            lower.set_offsets(lx, ly + overlap + pad)
            log('nudged %s down %dpx to clear %s' % (clean_name(lower), overlap + pad, clean_name(upper)))

    if job.get('canvas_width'):
        cw = int(job['canvas_width'])
        if cw != img.get_width():
            img.scale(cw, max(1, int(img.get_height() * cw / img.get_width())))
            log('canvas scaled to %dx%d' % (img.get_width(), img.get_height()))

    # 2a. armor shadow: replace the template's silhouette placeholder with an
    # all-black copy of the armor object, fitted inside the same area
    shadow_name = bg_spec.get('shadow')
    if shadow_name and job.get('armor_shadow'):
        ph = None
        for layer in img.get_layers():
            if clean_name(layer) == shadow_name:
                ph = layer
                break
        if ph is None:
            log('WARN shadow layer %r not found in template' % shadow_name)
        else:
            off = ph.get_offsets()
            bx, by = off.offset_x, off.offset_y
            bw, bh = ph.get_width(), ph.get_height()
            img.remove_layer(ph)
            sil = place_image(img, job['armor_shadow']['path'], 0, 0,
                              name='armor-shadow')
            s = min(bw / float(sil.get_width()), bh / float(sil.get_height()))
            sil.scale(max(1, int(sil.get_width() * s)),
                      max(1, int(sil.get_height() * s)), False)
            center_layer(sil, bx + bw / 2.0, by + bh / 2.0)
            if not sil.has_alpha():
                sil.add_alpha()
            img.select_item(Gimp.ChannelOps.REPLACE, sil)
            Gimp.context_set_foreground(Gegl.Color.new('#000000'))
            sil.edit_fill(Gimp.FillType.FOREGROUND)
            Gimp.Selection.none(img)
            log('armor shadow replaced (fit %dx%d at %d,%d)' % (bw, bh, bx, by))

    # 2b. plain images (armor object, character...)
    for spec in job.get('images', []):
        place_image(img, spec['path'], spec['x'], spec['y'],
                    spec.get('w'), spec.get('h'))
        log('image %s placed' % os.path.basename(spec['path']))

    # 3. insets: white circle (with pointer tail) + part draft centered on
    # (cx, cy); the tail is rotated to aim at point_to
    circle_path = os.path.join(tdir, manifest['circle']['file'])
    circle_d0 = manifest['circle'].get('circle_diameter')
    for spec in job.get('insets', []):
        d = spec['d']
        cx, cy = spec['cx'], spec['cy']
        csrc = load_image(circle_path)
        if len(csrc.get_layers()) > 1:
            csrc.merge_visible_layers(Gimp.MergeType.CLIP_TO_IMAGE)
        else:
            csrc.get_layers()[0].resize_to_image_size()
        circle = import_layer(csrc.get_layers()[0], img, 'inset-circle')
        csrc.delete()
        # the circle proper is the bottom square of the template, tail above it
        d0 = circle_d0 or circle.get_width()
        s = d / float(d0)
        circle.scale(max(1, int(circle.get_width() * s)),
                     max(1, int(circle.get_height() * s)), False)
        # put the CIRCLE's center (not the layer's) on (cx, cy): the circle
        # square sits at the bottom of the layer
        circle.set_offsets(int(cx - d / 2),
                           int(cy - (circle.get_height() - d / 2)))
        if spec.get('point_to'):
            tx, ty = spec['point_to']
            # template tail points up (-Y); rotate it toward the target
            rot = math.atan2(ty - cy, tx - cx) + math.pi / 2.0
            if abs(rot) > 0.01:
                circle.transform_rotate(rot, False, int(cx), int(cy))
                log('inset tail rotated %.0f deg toward (%s,%s)'
                    % (math.degrees(rot), tx, ty))
        part = place_image(img, spec['path'], 0, 0, w=int(d * 0.72), name='inset-part')
        if part.get_height() > d * 0.72:
            part.scale(max(1, int(part.get_width() * d * 0.72 / part.get_height())),
                       int(d * 0.72), False)
        center_layer(part, cx, cy)
        log('inset %s at (%s,%s)' % (os.path.basename(spec['path']), cx, cy))

    # 4. arrows: 3px black line from label end to star end, star + head + label
    arrow_spec = manifest['arrow']
    asrc = load_image(os.path.join(tdir, arrow_spec['file']))
    a_layers = {clean_name(l): l for l in asrc.get_layers()}
    star_src = a_layers.get(arrow_spec['layers']['star'])
    head_src = a_layers.get(arrow_spec['layers']['head'])
    label_src = a_layers.get(arrow_spec['layers']['label'])
    for spec in job.get('arrows', []):
        pts = spec['points']
        size = spec.get('size', 60)
        draw_polyline(img, pts, 3.0)
        if star_src is not None:
            star = import_layer(star_src, img, 'arrow-star')
            # the template layer is star + a line stub; keep the square left
            # end, which holds just the star
            h = star.get_height()
            star.resize(h, h, 0, 0)
            star.scale(int(size), int(size), False)
            center_layer(star, pts[-1][0], pts[-1][1])
        if head_src is not None and spec.get('head', True):
            head = import_layer(head_src, img, 'arrow-head')
            # square right end of the layer holds the head, pointing +X
            h = head.get_height()
            head.resize(h, h, -(head.get_width() - h), 0)
            head.scale(int(size), int(size), False)
            # point it away from the line (outward, past the label end)
            (x1, y1), (x2, y2) = pts[0], pts[1]
            angle = math.atan2(y1 - y2, x1 - x2)
            center_layer(head, pts[0][0], pts[0][1])
            if abs(angle) > 0.01:
                head.transform_rotate(angle, True, 0, 0)
        if label_src is not None and spec.get('label'):
            label = import_layer(label_src, img, 'label-' + spec['label'])
            # keep the template's font — only the size is adjusted, defaulting
            # to a clearly readable size relative to the canvas
            lsize = spec.get('label_size') or max(12.0, img.get_width() / 70.0)
            replace_text(label, spec['label'], size_pt=lsize)
            lx, ly = spec.get('label_pos', [pts[0][0], pts[0][1] - size])
            center_layer(label, lx, ly)
            log('arrow %s drawn' % spec['label'])
    asrc.delete()

    # 5. save — the XCF keeps every piece on its own layer so mistakes can be
    # fixed by hand in GIMP; only the JPG/preview are flattened
    if job.get('out_xcf'):
        Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, img,
                       Gio.File.new_for_path(job['out_xcf']), None)
    flat = img.duplicate()
    flat.flatten()
    if job.get('out_jpg'):
        Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, flat,
                       Gio.File.new_for_path(job['out_jpg']), None)
    if job.get('preview'):
        if flat.get_width() > 1400:
            flat.scale(1400, int(flat.get_height() * 1400 / flat.get_width()))
        Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, flat,
                       Gio.File.new_for_path(job['preview']), None)
    flat.delete()
    img.delete()


try:
    main()
    log('DONE')
except Exception:
    log('FATAL\n' + traceback.format_exc())
_log.close()
