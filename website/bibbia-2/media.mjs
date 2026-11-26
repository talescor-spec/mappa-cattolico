// Build-time responsive media. Original pages remain available for explicit zoom.
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../../', import.meta.url);
export const media = new Map();
function add(url, source, widths) {
 const revision = createHash('sha256').update('responsive-webp-q82-v1').update(fs.readFileSync(new URL(source, root))).digest('hex').slice(0, 10);
 const name = url.split('/').pop().replace(/\.[^.]+$/, '');
 const outputs = widths.map(width => ({ width, url: `/bibbia-2/assets/fast/${name}-${revision}-${width}.webp` }));
 media.set(url, { source, outputs });
}
for (const cover of ['mappa', 'panorama']) add(`/bibbia-2/assets/copertina-${cover}-hd.webp`, `website/bibbia-2/assets/copertina-${cover}-hd.webp`, [320, 640, 960]);
for (const page of ['pagina-01-illustrata','pagina-02','pagina-03','pagina-04','pagina-05','strumento-percorso-visuale','strumento-quaderno-visuale','strumento-continuare-visuale']) add(`/bibbia-2/assets/${page}.webp`, `website/bibbia-2/assets/${page}.webp`, [400, 800]);
for (const cover of ['catechismo','messa']) add(`/mappa-del-cattolico/assets/cover-${cover}-v1.webp`, `website/mappa-della-bibbia/assets/cover-${cover}-v1.webp`, [320, 640]);
export const srcset = item => item.outputs.map(({url,width}) => `${url} ${width}w`).join(', ');
export const coverSizes = '(max-width:740px) 60vw, 350px';
export function responsiveImages(html) {
 return html.replace(/<img\b[^>]*>/g, tag => {
  const url = tag.match(/\bsrc="([^"]+)"/)?.[1], item = media.get(url);
  if (!item) return tag;
  const cover = /copertina-/.test(url), small = /scene-sheet|capture-product/.test(tag);
  const sizes = small ? '(max-width:740px) 32vw, 245px' : cover ? coverSizes : '(max-width:740px) 88vw, 550px';
  return tag.replace(`src="${url}"`, `src="${item.outputs[0].url}" srcset="${srcset(item)}" sizes="${sizes}" decoding="async"`);
 }).replace(/<source srcset="([^"]+)" type="image\/webp">/g, (tag,url) => {
  const item = media.get(url);
  return item ? `<source srcset="${srcset(item)}" sizes="${coverSizes}" type="image/webp">` : tag;
 }).replace(/<link rel="preload" as="image" href="([^"]+)">/g, (tag,url) => {
  const item = media.get(url);
  return item ? `<link rel="preload" as="image" href="${item.outputs[0].url}" imagesrcset="${srcset(item)}" imagesizes="${coverSizes}" fetchpriority="high">` : tag;
 });
}
