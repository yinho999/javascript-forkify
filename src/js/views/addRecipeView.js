import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully uploaded';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  removeWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // Get data from the form when the submit is detected

      // The parameter should be a form element, in this case the "this" points to the parentlement which is a form

      // This will return an object we cant use, but we can spread it into an array
      const dataArr = [...new FormData(this)];
      // Return
      // [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
      // 0: (2) ["title", "TEST"]
      //   console.log(dataArr);
      // Convert the array of data to objects
      const data = Object.fromEntries(dataArr);
      // return
      // { title: "TEST", sourceUrl: "TEST", image: "TEST", publisher: "TEST", cookingTime: "23", … }
      handler(data);
    });
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.removeWindow.bind(this));
  }
}

export default new AddRecipeView();
