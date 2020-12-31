import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPageClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const nextMarkup = `
        <button data-goto="${currentPage + 1}" 
        class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>`;
    const prevMarkup = `
        <button data-goto="${currentPage - 1}" 
        class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`;

    // Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return nextMarkup;
    }
    // last page
    if (currentPage === numPages) {
      return prevMarkup;
    }
    // Other page
    if (currentPage < numPages && currentPage !== 1) {
      return `${nextMarkup}${prevMarkup}`;
    }
    // Page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
