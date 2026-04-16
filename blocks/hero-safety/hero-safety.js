/**
 * Hero Safety block JS
 * Maps EDS DOM structure to phx-* class names so phx Hero component CSS applies.
 */
export default function decorate(block) {
  // Add phx hero class names
  block.classList.add('phx-hero');

  const rows = [...block.children];

  // First row: background image
  if (rows[0]) {
    rows[0].classList.add('phx-hero__media');
    const pic = rows[0].querySelector('picture');
    if (pic) pic.classList.add('phx-hero__image');
  }

  // Second row: text content
  if (rows[1]) {
    rows[1].classList.add('phx-hero__content');
    const heading = rows[1].querySelector('h1, h2');
    if (heading) heading.classList.add('phx-hero__title');

    const paragraphs = rows[1].querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.querySelector('a')) {
        p.classList.add('phx-hero__cta');
      } else {
        p.classList.add('phx-hero__description');
      }
    });

    const links = rows[1].querySelectorAll('a');
    links.forEach((a) => a.classList.add('phx-button', 'phx-button--hero'));
  }
}
