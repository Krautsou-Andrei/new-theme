import {getUrlWithVariant} from '@shopify/theme-product-form';
import {formatMoney} from '@shopify/theme-currency';

const SELECTORS_FORM = {
  ADD_BUTTON_TEXT: '#button-add > span',
  BUTTON_ADD: '#button-add',
  BUTTON_BUY: '#button-buy',
  FORM: '#product-form',
  OUT_STOCK: '.form-out-stock',
  PRICE: '#price-value',
  RESPONSE_SECTIONS: 'alternate-header',
};

export default class Form {
  constructor(node) {
    this.container = node;
    this.productHandle = this.container.dataset.handle;
    this.formElement = this.container.querySelector(SELECTORS_FORM.FORM);
  }

  onOptionChange(event) {
    const variant = event.dataset.variant;

    if (!variant) return;

    this.changeNameColor(variant);

    this.toggleAddButton(variant);

    this.onQuantityChange(event);

    this.handleErrorMessage();

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({path: url}, '', url);
  }

  onQuantityChange(event) {
    this.handleErrorMessage();
    const variant = event.dataset.variant;
    const newQuantity = event.dataset.quantity;

    this.changePrice(variant, newQuantity);

    const variants = window.variants_inventory;
    let quantityVariant;
    const array = Object.keys(variants);

    array.forEach((element) => {
      if (element == variant.id) {
        quantityVariant = element;
      }
    });

    const input = document.querySelector('[data-input]');
    input.setAttribute('max', `${variants[quantityVariant]}`);
  }

  changePrice(variant, newQuantity = 1) {
    let newPrice = variant.price * newQuantity;

    newPrice = formatMoney(newPrice, this.container.dataset.moneyFormat);
    const price = this.container.querySelector(SELECTORS_FORM.PRICE);

    price.textContent = newPrice;
  }

  changeNameColor(variant) {
    const newNameColor = variant.name.split('/')[1];
    let nameColor = this.container.querySelector(
      `#label-discription-${this.container.dataset.productId}`,
    );

    nameColor.innerHTML = newNameColor;
  }

  toggleAddButton(variant) {
    const addButton = this.container.querySelector(SELECTORS_FORM.BUTTON_ADD);
    const buyButton = this.container.querySelector(SELECTORS_FORM.BUTTON_BUY);
    const addButtonText = this.container.querySelector(
      SELECTORS_FORM.ADD_BUTTON_TEXT,
    );

    if (!variant) {
      addButton.setAttribute('disabled', 'disabled');
      buyButton.setAttribute('disabled', 'disabled');
      addButtonText.textContent = window.variantStrings.unavailable;
    } else if (variant && !variant.available) {
      addButton.setAttribute('disabled', 'disabled');
      buyButton.setAttribute('disabled', 'disabled');
      addButtonText.textContent = window.variantStrings.soldOut;
    } else if (variant && variant.available) {
      addButton.removeAttribute('disabled');
      buyButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }
  }

  onFormSubmit(event) {
    event.preventDefault();
    fetch(event.target.action + '.js', {
      method: event.target.method,
      body: new FormData(event.target),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);
        } else {
          const event = new CustomEvent('cart:added', {
            detail: {
              header: response.sections[SELECTORS_FORM.RESPONSE_SECTIONS],
            },
            bubbles: true,
          });

          this.formElement.dispatchEvent(event);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessage = this.container.querySelector(SELECTORS_FORM.OUT_STOCK);
    this.errorMessage.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}
