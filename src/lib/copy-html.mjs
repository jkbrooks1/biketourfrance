// HTML rendering of copy markup. Everything is escaped; only the tags below can appear.
import { parseBlocks, parseInline } from './copy-markup.mjs';

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

/** @param {{type:string,text?:string,target?:string}[]} nodes @param {(target:string)=>string} hrefFor */
export function inlineHtml(nodes, hrefFor = (x) => x) {
  return nodes
    .map((n) => {
      if (n.type === 'br') return '<br>';
      if (n.type === 'strong') return `<strong>${escapeHtml(n.text)}</strong>`;
      if (n.type === 'link') {
        const href = hrefFor(n.target);
        const external = /^https:\/\//.test(href);
        return `<a href="${escapeHtml(href)}"${external ? ' rel="noopener"' : ''}>${escapeHtml(n.text)}</a>`;
      }
      return escapeHtml(n.text);
    })
    .join('');
}

/**
 * @param {string} text raw cell text
 * @param {{hrefFor?:(t:string)=>string, paragraphClass?:string, listClass?:string, inline?:boolean}} [options]
 */
export function blocksHtml(text, { hrefFor, paragraphClass, listClass, inline = false } = {}) {
  const blocks = parseBlocks(text);
  if (inline) return inlineHtml(blocks[0]?.inline ?? [], hrefFor);
  const cls = (c) => (c ? ` class="${escapeHtml(c)}"` : '');
  return blocks
    .map((b) => {
      if (b.type === 'ul')
        return `<ul${cls(listClass)}>${b.items.map((i) => `<li>${inlineHtml(i, hrefFor)}</li>`).join('')}</ul>`;
      if (b.type === 'p') return `<p${cls(paragraphClass)}>${inlineHtml(b.inline, hrefFor)}</p>`;
      return `<${b.type}>${inlineHtml(b.inline, hrefFor)}</${b.type}>`;
    })
    .join('\n');
}

export { parseInline };
