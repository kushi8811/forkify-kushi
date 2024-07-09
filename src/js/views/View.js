import icons from 'url:../../img/icons.svg'; //Parcel 2

export default class View {
  _data;
  /**
   *
   * @param {Object | Object[]} data The Data to be rendered (e.g recipe)
   * @param {boolean} [render=true] if false , create markup strings instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if render is false
   * @this{Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear(); // Remove any html before render
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('* '));
    const curentElements = Array.from(
      this._parentElement.querySelectorAll('*') //All of them
    );

    newElements.forEach((newEl, i) => {
      const curEl = curentElements[i];

      //UPDATES changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' //updating only the text inside the node elements
      ) {
        curEl.textContent = newEl.textContent;
      }
      //UPDATED changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) //Get name and update to value
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpiner() {
    const markup = `
       <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
