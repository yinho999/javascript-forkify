import View from './View';
import icons from '../../img/icons.svg';

export default class PreviewView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data.reduce((acc, el) => {
      return (acc += `<li class="preview">
              <a class="preview__link ${
                id === el.id ? 'preview__link--active' : 'preview__link'
              }" href="#${el.id}">
                <figure class="preview__fig">
                  <img src="${el.image}" alt="${el.title}" />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${el.title}</h4>
                  <p class="preview__publisher">${el.publisher}</p>
                  <div class="preview__user-generated ${
                    el.key ? '' : 'hidden'
                  }">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
                </div>
              </a>
            </li>
              `);
    }, '');
  }
}
