/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resource. Base: cards.
 * Source: novomedlink.com/semaglutide/patient-safety.html
 * xwalk model: container block, each card has image (reference) + text (richtext)
 * Block library: 2 cols per row. Col 1 = image, Col 2 = title + description + CTA
 */
export default function parse(element, { document }) {
  const resources = element.classList.contains('resource')
    ? [element]
    : Array.from(element.querySelectorAll('.resource'));

  if (resources.length === 0) {
    const cells = [['', '']];
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
    element.replaceWith(block);
    return;
  }

  const cells = [];

  resources.forEach((resource) => {
    const imgFrag = document.createDocumentFragment();
    const img = resource.querySelector('.resource__preview img, .resource-preview img, img');
    if (img && img.src && !img.src.startsWith('data:')) {
      imgFrag.appendChild(document.createComment(' field:image '));
      const pic = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      pic.appendChild(newImg);
      imgFrag.appendChild(pic);
    }

    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const titleEl = resource.querySelector('.resource__title, .resource__title .cmp-text');
    if (titleEl) {
      const heading = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      heading.appendChild(strong);
      textFrag.appendChild(heading);
    }

    const descEl = resource.querySelector('.resource__description, .resource__description .cmp-text');
    if (descEl) {
      const desc = document.createElement('p');
      desc.textContent = descEl.textContent.trim();
      textFrag.appendChild(desc);
    }

    const ctaLink = resource.querySelector('.resource__bottom a, .resource__footer a, a[href]');
    if (ctaLink && ctaLink.href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim() || 'Read more';
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
