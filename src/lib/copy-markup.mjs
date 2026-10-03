// The "copy markup" used in BTF_Approved_Site_Copy cells. Shared by the Astro components and by the
// build scripts, so the page and the verifier always read a cell the same way.
//
// Blocks are separated by a blank line:
//   ## text      second-level heading        ### text   third-level heading
//   - item       bullet list (consecutive lines)
//   anything else is a paragraph; a single line break inside a paragraph is kept as a line break.
// Inline: **bold** and [text](target). Everything else is literal text and is HTML-escaped on render.
// Link targets: an internal path (/path/), an in-page anchor (#id), https://..., or one of the
// symbolic mail targets mail:general, mail:waitlist, mail:planning (the code owns the actual mailto).

export const MAIL_TARGETS = ['mail:general', 'mail:waitlist', 'mail:planning'];

/** @param {string} text */
export function parseInline(text) {
  const out = [];
  const re = /\*\*([^*]+?)\*\*|\[([^\]]+?)\]\(([^)\s]+)\)|\n/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) });
    if (m[0] === '\n') out.push({ type: 'br' });
    else if (m[1] !== undefined) out.push({ type: 'strong', text: m[1] });
    else out.push({ type: 'link', text: m[2], target: m[3] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
  return out;
}

/** @param {string} text */
export function normalizeCell(text) {
  return String(text ?? '')
    .replace(/\r\n?/g, '\n')
    .trim();
}

/** @param {string} text */
export function parseBlocks(text) {
  const blocks = [];
  for (const chunk of normalizeCell(text).split(/\n{2,}/)) {
    const lines = chunk.split('\n').filter((l) => l.trim() !== '');
    if (!lines.length) continue;
    if (lines.length === 1 && /^### /.test(lines[0]))
      blocks.push({ type: 'h3', inline: parseInline(lines[0].slice(4)) });
    else if (lines.length === 1 && /^## /.test(lines[0]))
      blocks.push({ type: 'h2', inline: parseInline(lines[0].slice(3)) });
    else if (lines.every((l) => /^- /.test(l)))
      blocks.push({ type: 'ul', items: lines.map((l) => parseInline(l.slice(2))) });
    else blocks.push({ type: 'p', inline: parseInline(lines.join('\n')) });
  }
  return blocks;
}

/** Plain text of inline nodes (line breaks become spaces). */
export function inlineToPlain(nodes) {
  return nodes
    .map((n) => (n.type === 'br' ? ' ' : n.text))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Each block (paragraph, heading, or list item) as plain text, in display order. */
export function blockTexts(text) {
  const out = [];
  for (const b of parseBlocks(text)) {
    if (b.type === 'ul') for (const item of b.items) out.push(inlineToPlain(item));
    else out.push(inlineToPlain(b.inline));
  }
  return out.filter(Boolean);
}

/**
 * Like blockTexts, but a list item that links a title and adds a note after an em dash ("[Title](url) — note")
 * is split into its title and its note, because the page shows them as separate elements.
 */
export function fragmentTexts(text) {
  const out = [];
  for (const b of parseBlocks(text)) {
    const groups = b.type === 'ul' ? b.items : [b.inline];
    for (const nodes of groups) {
      const item = b.type === 'ul' ? parseLinkItem(nodes) : null;
      if (item) out.push(item.title, item.note);
      else out.push(inlineToPlain(nodes));
    }
  }
  return out.filter(Boolean);
}

export function toPlain(text) {
  return blockTexts(text).join(' ');
}

/** All link targets in a cell. */
export function linkTargets(text) {
  const targets = [];
  for (const b of parseBlocks(text)) {
    const groups = b.type === 'ul' ? b.items : [b.inline];
    for (const nodes of groups) for (const n of nodes) if (n.type === 'link') targets.push(n.target);
  }
  return targets;
}

/** Split a list item that links a title to a file/page, with an optional note after an em dash. */
export function parseLinkItem(nodes) {
  const link = nodes.find((n) => n.type === 'link');
  if (!link) return null;
  const rest = inlineToPlain(nodes.slice(nodes.indexOf(link) + 1)).replace(/^—\s*/, '');
  return { title: link.text, target: link.target, note: rest };
}
