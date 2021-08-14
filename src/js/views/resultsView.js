import PreviewView from './previewView';
import icons from '../../img/icons.svg';

class ResultViews extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';

}
export default new ResultViews();
