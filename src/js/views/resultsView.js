import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //Parcel 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No bookmarks yet.Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
