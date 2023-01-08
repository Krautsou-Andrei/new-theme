import {register} from '@shopify/theme-sections';
import {ProductForm} from '@shopify/theme-product-form';

import Accordion from '../component/accordion';
import Form from '../component/form';
import Quantity from '../component/quantity';

// -------------------------------------------register---------------------------

register('alternate-main-product', {
  accordeon: null,
  form: null,
  productForm: null,
  formElement: null,
  quantity: null,

  onLoad() {
    this.accordeon = new Accordion(this.container);
    this.form = new Form(this.container);
    this.quantity = new Quantity(this.container);

    this.formElement = this.form.formElement;
    const productHandle = this.form.productHandle;

    fetch(`/products/${productHandle}.js`)
      .then((response) => {
        return response.json();
      })
      .then((productJSON) => {
        this.productForm = new ProductForm(this.formElement, productJSON, {
          onOptionChange: this.form.onOptionChange.bind(this.form),
          onFormSubmit: this.form.onFormSubmit.bind(this.form),
          onQuantityChange: this.form.onQuantityChange.bind(this.form),
        });
      });
  },

  onUnload() {
    if (this.productForm) {
      this.productForm.destroy();
    }
    if (this.accordeon) {
      this.accordeon.destroy();
    }
  },

  onBlockSelect(event) {
    this.accordeon.sectionsInit.forEach((section) => {
      if (section.element.id === event.target.id) {
        section.opened();
      }
    });
  },

  onBlockDeselect(event) {
    this.accordeon.sectionsInit.forEach((section) => {
      if (section.element.id === event.target.id) {
        section.closed();
      }
    });
  },
});
