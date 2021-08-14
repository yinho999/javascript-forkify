import PreviewView from './previewView';
import icons from '../../img/icons.svg';

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Recipes Found for you Query! Please Try again';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
