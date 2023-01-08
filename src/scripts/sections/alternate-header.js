import {register} from '@shopify/theme-sections';

import Listeners from '../component/listeners';
import MenuBurger from '../component/menu-burger';

const SELECTORS = {
  NEW_QUANTITY: 'cart-quantity',
  QUANTITY: '.cart-preview__quantity',
};

class QuantityCartView {
  constructor(node) {
    this.element = node;
    this.quantity = this.element.querySelectorAll(SELECTORS.QUANTITY);
    this._listeners = new Listeners();
    this._listeners.add(document, 'cart:added', this.change.bind(this));
  }

  change(event) {
    const parser = new DOMParser();
    const newQuantity = parser.parseFromString(
      event.detail.header,
      'text/html',
    );

    this.quantity.forEach((element) => {
      element.innerHTML = newQuantity.getElementById(
        SELECTORS.NEW_QUANTITY,
      ).innerHTML;
    });
  }

  destroy() {
    this._listeners.removeAll(document, 'cart:added', this.change.bind(this));
  }
}

register('alternate-header', {
  quantityCartView: null,

  onLoad() {
    this.quantityCartView = new QuantityCartView(this.container);
    this.menuBurger = new MenuBurger(this.container);
  },

  onUnload() {
    this.quantityCartView.destroy();
    this.menuBurger.destroy();
  },
});
