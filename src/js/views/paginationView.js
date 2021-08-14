import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Add event listener
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;
    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > currentPage) {
      return nextPage(currentPage);
    }

    // Page 1, and there are NO other pages
    if (currentPage === 1 && numPages === currentPage) {
      return ``;
    }

    // Last Page
    if (currentPage === numPages) {
      return previousPage(currentPage);
    }

    // Other page
    if (currentPage < numPages && currentPage > 1) {
      return ` ${previousPage(currentPage)}${nextPage(currentPage)}
    `;
    }
  }
}

function previousPage(currentPage) {
  return `<button data-goto=${
    currentPage - 1
  } class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${currentPage - 1}</span>
  </button>`;
}
function nextPage(currentPage) {
  return `<button data-goto=${
    currentPage + 1
  } class="btn--inline pagination__btn--next">
    <span>Page ${currentPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
}
export default new PaginationView();
