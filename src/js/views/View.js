import icons from '../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the recieved Object to the DOM - (VScode recognize this description and will appear this msg when hover this function)
   * @param {Object|Object[]} data - The data to be rendered (e.g. recipe)
   * @param {Boolean} render - If false - create a markupstring instead of rendering to the DOM
   * @returns {undefined\string} A markup string is returned if render = false
   * @this {Object}View instance ("this" keyword points to view Object itself)
   * @author Naiker
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const recipeHTML = this._generateMarkup();
    if (!render) return recipeHTML;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', recipeHTML);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Update only different text and attribute than the old one
  update(data) {
    this._data = data;

    // Get the new HTML strings
    const newHTML = this._generateMarkup();

    // Create a virtual dom from new html string
    const newDOM = document.createRange().createContextualFragment(newHTML);

    // New updated html elements
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Current html elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));
      // If the new element and current element is not equal, the current element will be replaced by the old element
      // if (!newEl.isEqualNode(curEl)) {
      //   curEl.innerHTML = newEl.innerHTML;
      // }

      // Only change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Only change Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  ///////////////////////////////////////
  // Render Spinner
  renderSpinner() {
    const html = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  renderError(message = this._errorMessage) {
    const html = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  renderMessage(message = this._message) {
    const html = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
