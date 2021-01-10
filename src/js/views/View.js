import icons from 'url:../../img/icons.svg';

//this will become the parent class
export default class View {
  _data;

  //JSDoc
  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup String instead of rendering to the DOM
   * @returns {undefine | string} A markup string is returned if the render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    //check if there is any data or if the data is an array and the length of the array is 0
    //then show the error message
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //the newMarkup (string) will be converted into a virtual DOM object which can be compare to the old markup DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    //selecting all the elements in the virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    //selecting all the elements in the current DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //check if the new elements are not equal to the old elements and check for whether the elements checked is a text
      //nodeValue will only return a value if it is texts
      //updating the changed text
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      //updating the changed attribute
      if (!newEl.isEqualNode(curEl)) {
        //looping over the attributes of the new elements to set the current elements attributes to the updated
        //newEl.attributes will create an object
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
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

  //if no error message is pass in, the the message will become the default error message
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
