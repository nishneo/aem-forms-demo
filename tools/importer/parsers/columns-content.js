/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-content. Base: columns.
 * Source: novomedlink.com/semaglutide/patient-safety.html
 * xwalk: Columns blocks do NOT require field hint comments.
 * Block library: N rows, each row has 2 columns side by side.
 */
export default function parse(element, { document }) {
  const flexContainer = element.querySelector('.cmp-container.flex');
  const columnContainers = flexContainer
    ? flexContainer.querySelectorAll(':scope > div > .container.responsivegrid')
    : element.querySelectorAll(':scope > div > .container.responsivegrid');

  const leftCol = document.createDocumentFragment();
  const rightCol = document.createDocumentFragment();

  if (columnContainers.length >= 2) {
    [columnContainers[0], columnContainers[1]].forEach((col, idx) => {
      const target = idx === 0 ? leftCol : rightCol;

      col.querySelectorAll('.cmp-title h1, .cmp-title h2, .cmp-title h3').forEach((h) => {
        const heading = document.createElement(h.tagName);
        heading.innerHTML = h.innerHTML;
        target.appendChild(heading);
      });

      col.querySelectorAll('.cmp-text p').forEach((p) => {
        const para = document.createElement('p');
        para.innerHTML = p.innerHTML;
        target.appendChild(para);
      });

      col.querySelectorAll('.cmp-image__image, img').forEach((img) => {
        if (img.src && !img.src.startsWith('data:')) {
          const pic = document.createElement('picture');
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt || '';
          pic.appendChild(newImg);
          target.appendChild(pic);
        }
      });

      col.querySelectorAll('.cmp-video__poster').forEach((poster) => {
        if (poster.src) {
          const pic = document.createElement('picture');
          const newImg = document.createElement('img');
          newImg.src = poster.src;
          newImg.alt = poster.alt || '';
          pic.appendChild(newImg);
          target.appendChild(pic);
        }
      });

      col.querySelectorAll('.nni-hcp--button a, a.button').forEach((a) => {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = a.href;
        const btnText = a.querySelector('.button-text');
        link.textContent = btnText ? btnText.textContent.trim() : a.textContent.trim();
        p.appendChild(link);
        target.appendChild(p);
      });
    });
  }

  const cells = [[leftCol, rightCol]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-content', cells });
  element.replaceWith(block);
}
