"""
Generate premium DOCX from rapport-agria.md — Golden Hour design system.
"""
import re, os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml
from docx.oxml.shared import OxmlElement

# ═══════════════════ PALETTE ═══════════════════
GOLD       = RGBColor(0xE8, 0xB8, 0x4B)
TERRA      = RGBColor(0xC4, 0x70, 0x4A)
DANGER     = RGBColor(0xB5, 0x53, 0x3A)
SUCCESS    = RGBColor(0x7A, 0x9E, 0x5A)
BROWN      = RGBColor(0x3D, 0x2E, 0x1F)
BROWN_SEC  = RGBColor(0x6B, 0x5D, 0x4F)
MUTED      = RGBColor(0xA8, 0x98, 0x80)
SURFACE    = RGBColor(0xFF, 0xFD, 0xF6)
BG_OUTER   = RGBColor(0xF3, 0xEF, 0xE6)
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
FONT_SERIF = 'Fraunces'
FONT_SANS  = 'Outfit'
FONT_MONO  = 'Consolas'

# ═══════════════════ PATHS ═══════════════════
ROOT = os.path.dirname(os.path.abspath(__file__))
MOBILE = os.path.dirname(ROOT)
MD_PATH = os.path.join(MOBILE, 'rapport-agria.md')
IMG_ARCHI = os.path.join(MOBILE, 'schema app.png')
IMG_COUCHES = os.path.join(MOBILE, 'schema couches.png')

# ═══════════════════ HELPERS ═══════════════════

def set_cell_shading(cell, color_hex):
    el = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}" w:val="clear"/>')
    el.append(shd)

def set_para_bg(para, color_hex):
    el = para._p.get_or_add_pPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}" w:val="clear"/>')
    el.append(shd)

def golden_line(doc, width=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.space_before = Pt(3)
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), str(width * 8))
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), 'E8B84B')
    pBdr.append(bottom)
    pPr.append(pBdr)
    return p

def left_border(para, color_hex):
    pPr = para._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    left = OxmlElement('w:left')
    left.set(qn('w:val'), 'single')
    left.set(qn('w:sz'), '24')
    left.set(qn('w:space'), '8')
    left.set(qn('w:color'), color_hex)
    pBdr.append(left)
    pPr.append(pBdr)

def insert_toc(doc):
    """Insert a Word Table of Contents field (clickable after Update Field in Word)."""
    body(doc, '', sa=8)
    p = doc.add_paragraph()
    # TOC field: \o "1-3" = headings level 1-3, \h = hyperlinks
    runs_data = [
        ('begin', None),
        ('instr', ' TOC \\o "1-3" \\h \\z \\u '),
        ('separate', None),
        ('text', '[ Mettre a jour le champ : clic droit, puis Mettre a jour le champ, ou Ctrl+A puis F9 ]'),
        ('end', None),
    ]
    for kind, text in runs_data:
        r = p.add_run()
        r.font.size = Pt(10); r.font.color.rgb = MUTED; r.font.name = FONT_SANS; r.italic = True
        if kind == 'begin':
            r._r.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>'))
        elif kind == 'instr':
            r._r.append(parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve">{text}</w:instrText>'))
        elif kind == 'separate':
            r._r.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="separate"/>'))
        elif kind == 'end':
            r._r.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>'))
        elif kind == 'text':
            r.text = text
    body(doc, '', sa=12)
    page_break(doc)

def add_page_numbers(doc):
    for section in doc.sections:
        footer = section.footer
        footer.is_linked_to_previous = False
        for p in footer.paragraphs:
            p.clear()
        p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for tag in ['begin', '', 'end']:
            r = p.add_run()
            r.font.size = Pt(9); r.font.color.rgb = MUTED; r.font.name = FONT_SANS
            if tag == 'begin':
                r._r.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>'))
            elif tag == 'end':
                r._r.append(parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>'))
            else:
                r._r.append(parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>'))

def add_headers(doc):
    for section in doc.sections:
        header = section.header
        header.is_linked_to_previous = False
        for p in header.paragraphs:
            p.clear()
        p = header.paragraphs[0] if header.paragraphs else header.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r = p.add_run('AGRIA')
        r.font.size = Pt(9); r.font.color.rgb = MUTED; r.font.name = FONT_SERIF; r.bold = True
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement('w:pBdr')
        bottom = OxmlElement('w:bottom')
        bottom.set(qn('w:val'), 'single'); bottom.set(qn('w:sz'), '4')
        bottom.set(qn('w:space'), '4'); bottom.set(qn('w:color'), 'E8B84B')
        pBdr.append(bottom)
        pPr.append(pBdr)

def insert_image(doc, path, width=5.2, caption=''):
    if not os.path.exists(path):
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run()
    r.add_picture(path, width=Inches(width))
    if caption:
        cp = doc.add_paragraph()
        cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cp.paragraph_format.space_after = Pt(12)
        cr = cp.add_run(caption)
        cr.font.size = Pt(9); cr.font.color.rgb = MUTED; cr.font.name = FONT_SANS; cr.italic = True

def page_break(doc):
    doc.add_page_break()

def h1(doc, text):
    h = doc.add_heading(text, level=1)
    h.paragraph_format.space_before = Pt(24)
    h.paragraph_format.space_after = Pt(6)
    for r in h.runs:
        r.font.size = Pt(22); r.font.name = FONT_SERIF; r.font.color.rgb = BROWN; r.bold = True
    golden_line(doc)
    return h

def h2(doc, text):
    h = doc.add_heading(text, level=2)
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(4)
    for r in h.runs:
        r.font.size = Pt(15); r.font.name = FONT_SANS; r.font.color.rgb = TERRA; r.bold = True
    return h

def h3(doc, text):
    h = doc.add_heading(text, level=3)
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(3)
    for r in h.runs:
        r.font.size = Pt(12); r.font.name = FONT_SERIF; r.font.color.rgb = BROWN; r.bold = True
    return h

def h4(doc, text):
    h = doc.add_heading(text, level=4)
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    for r in h.runs:
        r.font.size = Pt(11); r.font.name = FONT_SANS; r.font.color.rgb = BROWN_SEC; r.bold = True
    return h

def body(doc, text, sa=8, sb=0, align=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(sa)
    p.paragraph_format.space_before = Pt(sb)
    p.paragraph_format.line_spacing = 1.35
    if align: p.alignment = align
    r = p.add_run(text)
    r.font.size = Pt(11.5); r.font.color.rgb = BROWN; r.font.name = FONT_SANS
    return p

def rich_body(doc, segments, sa=8, sb=0, align=None):
    """segments: [(text, bold, italic, font, color, size)]"""
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(sa)
    p.paragraph_format.space_before = Pt(sb)
    p.paragraph_format.line_spacing = 1.35
    if align: p.alignment = align
    for text, bold, italic, font, color, size in segments:
        r = p.add_run(text)
        r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = font
        r.bold = bold; r.italic = italic
    return p

def parse_inline(text, default_size=11.5):
    segs = []; i = 0
    while i < len(text):
        m = re.match(r'`([^`]+)`', text[i:])
        if m:
            segs.append((m.group(1), False, False, FONT_MONO, BROWN_SEC, 10))
            i += len(m.group(0)); continue
        m = re.match(r'\*\*(.+?)\*\*', text[i:])
        if m:
            segs.append((m.group(1), True, False, FONT_SANS, BROWN, default_size))
            i += len(m.group(0)); continue
        m = re.match(r'\*(.+?)\*', text[i:])
        if m:
            segs.append((m.group(1), False, True, FONT_SANS, BROWN, default_size))
            i += len(m.group(0)); continue
        j = i
        while j < len(text) and text[j] not in '`*': j += 1
        if j > i:
            segs.append((text[i:j], False, False, FONT_SANS, BROWN, default_size))
        i = j
        if i < len(text) and text[i] not in '`*':
            segs.append((text[i], False, False, FONT_SANS, BROWN, default_size)); i += 1
    return segs

def md_body(doc, text, sa=8, sb=0, align=None, size=11.5):
    segs = parse_inline(text, size)
    if not segs: segs = [('', False, False, FONT_SANS, BROWN, size)]
    return rich_body(doc, segs, sa, sb, align)

def bullet(doc, text, bold_prefix='', size=11):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3); p.paragraph_format.space_before = Pt(0)
    if bold_prefix:
        rb = p.add_run(bold_prefix)
        rb.bold = True; rb.font.size = Pt(size); rb.font.name = FONT_SANS; rb.font.color.rgb = BROWN
    r = p.add_run(text)
    r.font.size = Pt(size); r.font.name = FONT_SANS; r.font.color.rgb = BROWN
    return p

def number_item(doc, text, size=11):
    """Numbered list item — preserves the number prefix."""
    p = doc.add_paragraph(style='List Number')
    p.paragraph_format.space_after = Pt(3); p.paragraph_format.space_before = Pt(0)
    r = p.add_run(text)
    r.font.size = Pt(size); r.font.name = FONT_SANS; r.font.color.rgb = BROWN
    return p

def code_block(doc, text):
    for line in text.strip().split('\n'):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0); p.paragraph_format.space_before = Pt(0)
        set_para_bg(p, 'F3EFE6')
        r = p.add_run(line)
        r.font.size = Pt(8.5); r.font.name = FONT_MONO; r.font.color.rgb = BROWN_SEC
    body(doc, '', sa=4)

def styled_table(doc, rows):
    cols = max(len(r) for r in rows)
    t = doc.add_table(rows=len(rows), cols=cols)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Golden borders
    tbl = t._tbl
    tblPr = tbl.tblPr if tbl.tblPr is not None else OxmlElement('w:tblPr')
    tblBorders = OxmlElement('w:tblBorders')
    for edge in ('top','left','bottom','right','insideH','insideV'):
        el = OxmlElement(f'w:{edge}')
        el.set(qn('w:val'), 'single'); el.set(qn('w:sz'), '4'); el.set(qn('w:color'), 'EBE3D3')
        tblBorders.append(el)
    tblPr.append(tblBorders)

    for i, row_data in enumerate(rows):
        for j in range(cols):
            cell = t.cell(i, j)
            cell.text = ''
            val = row_data[j] if j < len(row_data) else ''
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.line_spacing = 1.2
            r = p.add_run(str(val))
            r.font.size = Pt(9.5); r.font.name = FONT_SANS
            if i == 0:
                r.bold = True; r.font.size = Pt(10)
                r.font.color.rgb = WHITE; r.font.name = FONT_SERIF
                set_cell_shading(cell, 'E8B84B')
            else:
                r.font.color.rgb = BROWN
                set_cell_shading(cell, 'FFFDF6' if i % 2 == 0 else 'F3EFE6')
    body(doc, '', sa=6)
    return t

def problem_block(doc, problem_text, solution_text):
    p1 = doc.add_paragraph()
    p1.paragraph_format.space_before = Pt(10)
    p1.paragraph_format.space_after = Pt(3)
    left_border(p1, 'B5533A')
    rb = p1.add_run('Problème : ')
    rb.bold = True; rb.font.size = Pt(11); rb.font.name = FONT_SANS; rb.font.color.rgb = DANGER
    rp = p1.add_run(problem_text)
    rp.font.size = Pt(11); rp.font.name = FONT_SANS; rp.font.color.rgb = BROWN

    p2 = doc.add_paragraph()
    p2.paragraph_format.space_before = Pt(2)
    p2.paragraph_format.space_after = Pt(12)
    left_border(p2, '7A9E5A')
    rs = p2.add_run('Solution : ')
    rs.bold = True; rs.font.size = Pt(11); rs.font.name = FONT_SANS; rs.font.color.rgb = SUCCESS
    rps = p2.add_run(solution_text)
    rps.font.size = Pt(11); rps.font.name = FONT_SANS; rps.font.color.rgb = BROWN

# ═══════════════════ COVER ═══════════════════
def create_cover(doc):
    for _ in range(5):
        body(doc, '', sa=14)
    # Top line
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('━ ' * 20); r.font.size = Pt(6); r.font.color.rgb = GOLD
    body(doc, '', sa=20)
    # Title
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run('AGRIA'); r.font.size = Pt(44); r.font.color.rgb = BROWN; r.font.name = FONT_SERIF; r.bold = True
    # Subtitle
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run('Rapport de projet — IA & Agriculture')
    r.font.size = Pt(15); r.font.color.rgb = BROWN_SEC; r.font.name = FONT_SANS
    golden_line(doc)
    body(doc, '', sa=14)
    # Description
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(6)
    r = p.add_run('Assistant agricole intelligent\nGestion de parcelles · Diagnostic de cultures · Alertes météo')
    r.font.size = Pt(11); r.font.color.rgb = MUTED; r.font.name = FONT_SANS
    body(doc, '', sa=30)
    # Infos
    for label, value in [
        ('Formation', 'Bachelor 1 — Sup de Vinci'),
        ('Thématique', 'IA & Agriculture'),
        ('Année', '2025 / 2026'),
        ('Équipe', 'Mathieu · Nathan · Timéo · Lucas T.'),
        ('Rendu', 'Mai 2026'),
    ]:
        p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(2)
        rl = p.add_run(f'{label}  '); rl.font.size = Pt(10); rl.font.color.rgb = MUTED; rl.font.name = FONT_SANS; rl.bold = True
        rv = p.add_run(value); rv.font.size = Pt(11); rv.font.color.rgb = BROWN; rv.font.name = FONT_SANS
    body(doc, '', sa=20)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run('━ ' * 20); r.font.size = Pt(6); r.font.color.rgb = GOLD
    page_break(doc)

# ═══════════════════ MAIN ═══════════════════
def generate():
    doc = Document()
    for section in doc.sections:
        section.top_margin = Cm(2.5)
        section.bottom_margin = Cm(2.5)
        section.left_margin = Cm(2.2)
        section.right_margin = Cm(2.2)

    style = doc.styles['Normal']
    style.font.name = FONT_SANS
    style.font.size = Pt(11.5)
    style.font.color.rgb = BROWN
    style.paragraph_format.line_spacing = 1.35

    with open(MD_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    parts = content.split('\n## Sommaire\n', 1)
    body_content = '## Sommaire\n' + (parts[1] if len(parts) > 1 else '')

    create_cover(doc)
    add_headers(doc)

    lines = body_content.split('\n')
    i = 0
    in_code = False; code_buf = []
    in_table = False; table_buf = []

    # Track section for image placement
    current_section = None
    need_image_archi = False
    need_image_couches = False
    placed_archi = False
    placed_couches = False

    while i < len(lines):
        line = lines[i].rstrip('\r')
        stripped = line.strip()

        # Code blocks
        if stripped.startswith('```'):
            if in_code:
                code_block(doc, '\n'.join(code_buf))
                code_buf = []; in_code = False
            else:
                in_code = True
            i += 1; continue
        if in_code:
            code_buf.append(line); i += 1; continue

        # Tables
        if stripped.startswith('|') and stripped.endswith('|'):
            if not in_table:
                in_table = True; table_buf = []
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                i += 1; continue
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            table_buf.append(cells); i += 1; continue
        elif in_table:
            in_table = False
            if table_buf:
                styled_table(doc, table_buf)
            table_buf = []
            continue

        # Detect ## headings (sections)
        m_main = re.match(r'^## (\d+)\. (.+)', line)
        m_other = re.match(r'^## (.+)', line)

        if m_main:
            num, title = m_main.group(1), m_main.group(2)
            full = f'{num}. {title}'
            current_section = num
            page_break(doc)
            h1(doc, full)
            # Insert architecture schema after §4 heading
            if num == '4' and not placed_archi:
                need_image_archi = True
            # Insert layers schema after §8 heading
            if num == '8' and not placed_couches:
                need_image_couches = True
            i += 1; continue

        if m_other:
            title = m_other.group(1)
            if title == 'Sommaire':
                h1(doc, title)
                insert_toc(doc)
                # Skip Sommaire list items until next section
                i += 1
                while i < len(lines):
                    nl = lines[i].rstrip('\r').strip()
                    if re.match(r'^## ', nl) or nl == '---':
                        break
                    i += 1
                continue
            else:
                page_break(doc)
                h1(doc, title)
            i += 1; continue

        # Detect ### headings
        m = re.match(r'^### (.+)', line)
        if m:
            title = m.group(1)
            h2(doc, title)
            # Place architecture image right after §4.5 heading
            if need_image_archi and 'Architecture technique' in title:
                insert_image(doc, IMG_ARCHI, width=5.2, caption='Architecture globale Agria')
                need_image_archi = False
                placed_archi = True
            # Place layers image right after §8.1 heading
            if need_image_couches and 'Architecture globale' in title:
                insert_image(doc, IMG_COUCHES, width=5.2, caption='Architecture en couches')
                need_image_couches = False
                placed_couches = True
            i += 1; continue

        # Detect #### headings
        m = re.match(r'^#### (.+)', line)
        if m:
            h3(doc, m.group(1))
            i += 1; continue

        # HR
        if stripped == '---':
            golden_line(doc)
            i += 1; continue

        # Problem/Solution blocks
        if stripped.startswith('**Problème'):
            prob = stripped.replace('**Problème** :', '').replace('**Problème** :', '').strip()
            sol_lines = []
            i += 1
            while i < len(lines):
                nl = lines[i].rstrip('\r').strip()
                if nl.startswith('###') or nl.startswith('##'):
                    break
                if nl.startswith('**Solution** :'):
                    sol_lines.append(nl.replace('**Solution** :', '').strip())
                elif nl.startswith('**Solution**'):
                    pass
                elif sol_lines:
                    sol_lines[-1] += ' ' + nl
                i += 1
            problem_block(doc, prob, ' '.join(sol_lines) if sol_lines else '')
            continue

        # Bullets
        if re.match(r'^- ', stripped):
            text = re.sub(r'^- ', '', stripped)
            bm = re.match(r'^\*\*(.+?)\*\*\s*:\s*(.*)', text)
            if bm:
                bullet(doc, bm.group(2), bold_prefix=bm.group(1) + ' : ')
            else:
                bullet(doc, text)
            i += 1; continue

        # Numbered items
        if re.match(r'^\d+\.\s', stripped):
            # Keep the number for TOC items, but strip for content
            # For Sommaire-like items (contain " - " subsections pattern), keep number
            text_with_num = stripped  # keep full "1. Remerciements"
            bm = re.match(r'^\*\*(.+?)\*\*\s*:\s*(.*)', stripped)
            if bm:
                bullet(doc, bm.group(2), bold_prefix=bm.group(1) + ' : ')
            else:
                number_item(doc, text_with_num)
            i += 1; continue

        # Empty
        if stripped == '':
            i += 1; continue

        # Regular paragraph
        md_body(doc, stripped)
        i += 1

    # Flush remaining
    if in_table and table_buf:
        styled_table(doc, table_buf)

    # Insert any remaining images
    if not placed_archi:
        page_break(doc)
        h1(doc, 'Schéma d\'architecture')
        insert_image(doc, IMG_ARCHI, width=5.5, caption='Architecture globale Agria')
    if not placed_couches:
        page_break(doc)
        h1(doc, 'Architecture en couches')
        insert_image(doc, IMG_COUCHES, width=5.5, caption='Architecture en couches Agria')

    add_page_numbers(doc)
    add_headers(doc)

    out = os.path.join(MOBILE, 'rapport-agria-v2.docx')
    doc.save(out)
    print(f'\nDOCX saved: {out}')
    print(f'  Paragraphs: {len(doc.paragraphs)}')
    print(f'  Tables: {len(doc.tables)}')

if __name__ == '__main__':
    generate()
