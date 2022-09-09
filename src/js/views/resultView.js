import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = ' No recepie found. Please, try another name';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultView();
