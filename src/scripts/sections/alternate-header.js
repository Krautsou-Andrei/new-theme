import {register} from '@shopify/theme-sections';

const SELECTORS = {
  NEW_QUANTITY: 'cart-quantity',
  QUANTITY: '.cart-preview__quantity',
};

class Quantity {
  constructor(node) {
    this.element = node;
    this.quantity = this.element.querySelectorAll(SELECTORS.QUANTITY);

    this.change = this.change.bind(this);
    document.addEventListener('cart:added', this.change);
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
    document.removeEventListener('cart:added', this.change);
  }
}

register('alternate-header', {
  quantity: null,

  onLoad() {
    this.quantity = new Quantity(this.container);
  },

  onUnload() {
    this.quantity.destroy();
  },
});
