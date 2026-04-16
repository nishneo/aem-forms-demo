/**
 * Columns Content block JS
 * No phx component equivalent — adds structural classes for EDS layout.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-content-${cols.length}-cols`);

  // Setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-content-img-col');
        }
      }
    });
  });
}
