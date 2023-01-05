import {register} from '@shopify/theme-sections';
import {ProductForm} from '@shopify/theme-product-form';
import Accordion from '../component/accordion';
import Form from '../component/form';

// -------------------------------------------quantity---------------------------
const input = document.querySelector('[data-input]');
const decrease = document.querySelector('[data-decrease]');
const increase = document.querySelector('[data-increase]');

let changeIn = new Event('change', {bubbles: true});

decrease.addEventListener('click', () => {
  input.stepDown();
  input.dispatchEvent(changeIn);
});

increase.addEventListener('click', () => {
  input.stepUp();
  input.dispatchEvent(changeIn);
});

// const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

// const isInRange = (value, min, max) => value >= min && value <= max;

// const changeInput = new CustomEvent('change', {bubbles: true});

// const calcStep = (value, step, min, max) => {
//   const isValueInRange = isInRange(value, min, max);
//   return clamp(isValueInRange ? value + step : value, min, max);
// };

// const createQuantity = (
//   initialValue = null,
//   step = 1,
//   min = -Infinity,
//   max = Infinity,
// ) => {
//   const eventTarget = new EventTarget();

//   const dispatchEvent = (type, detail) => {
//     eventTarget.dispatchEvent(new CustomEvent(type, {detail}));
//   };

//   return {
//     value: initialValue,
//     addEventListener(event, callback) {
//       eventTarget.addEventListener(event, callback);
//     },
//     removeEventListener(event, callback) {
//       eventTarget.removeEventListener(event, callback);
//     },
//     getValue() {
//       return this.value;
//     },
//     setValue(value) {
//       this.value = clamp(value, min, max);
//       dispatchEvent('change', {value: this.value});
//     },
//     increase() {
//       this.setValue(calcStep(this.value, step, min, max));
//     },

//     decrease() {
//       this.setValue(calcStep(this.value, -step, min, max));
//     },
//   };
// };

// const creatQuanyityView = (element, initialValue, step, min, max) => {
//   const quantity = createQuantity(initialValue, step, min, max);

//   const input = element.querySelector('[data-input]');
//   const decrease = element.querySelector('[data-decrease]');
//   const increase = element.querySelector('[data-increase]');

//   const render = () => {
//     const value = quantity.getValue();
//     input.step = step;
//     input.min = min;
//     input.max = max;
//     input.value = value;
//     decrease.disabled = value <= min;
//     increase.disabled = value >= max;
//   };

//   input.addEventListener('change', ({target: {value}}) => {
//     quantity.setValue(value);
//   });

//   decrease.addEventListener('click', () => {
//     quantity.decrease();
//     input.dispatchEvent(changeInput);
//   });
//   increase.addEventListener('click', () => {
//     quantity.increase();
//     input.dispatchEvent(changeInput);
//   });

//   quantity.addEventListener('change', render);

//   render();
// };

// creatQuanyityView(document.querySelector('[data-quantity]'), 1, 1, 1, 999);

// -------------------------------------------register---------------------------

register('alternate-main-product', {
  accordeon: null,
  form: null,
  productForm: null,
  formElement: null,

  onLoad() {
    this.accordeon = new Accordion(this.container);
    this.form = new Form(this.container);

    this.formElement = this.form.formElement;
    const productHandle = this.form.productHandle;
    console.log('productHandle', productHandle);
    fetch(`/products/${productHandle}.js`)
      .then((response) => {
        console.log('this.response', response);
        return response.json();
      })
      .then((productJSON) => {
        console.log('productJSON', productJSON);

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
    return;
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
