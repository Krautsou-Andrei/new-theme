import Listeners from './listeners';

const SELECTORS_QUANTITY = {
  INCREASE: '[data-increase]',
  INPUT: '[data-input]',
  DECREASE: '[data-decrease]',
  QUANTITY: '[data-quantity]',
};

const OPTIONS = {
  initialValue: 1,
  step: 1,
  min: 1,
  max: Infinity,
};

// -------------------------------------------quantity---------------------------

class CreateQuantity {
  constructor(options) {
    this.value = options.initialValue || OPTIONS.initialValue;
    this.step = options.step || OPTIONS.step;
    this.min = options.min || OPTIONS.min;
    this.max = options.max || OPTIONS.max;
    this.eventTarget = new EventTarget();
    this._listeners = new Listeners();
  }

  clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
  }

  isInRange(value, min, max) {
    return value >= min && value <= max;
  }

  calcStep(value, step, min, max) {
    const isValueInRange = this.isInRange(value, min, max);
    return this.clamp(isValueInRange ? value + step : value, min, max);
  }

  dispatchEvent(type, detail) {
    this.eventTarget.dispatchEvent(new CustomEvent(type, {detail}));
  }

  addEventListener(event, callback) {
    this._listeners.add(this.eventTarget, event, callback);
  }

  removeEventListener(event, callback) {
    this._listeners.removeAll(this.eventTarget, event, callback);
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = this.clamp(value, this.min, this.max);
    this.dispatchEvent('change', {value: this.value});
  }

  increase() {
    this.setValue(this.calcStep(this.value, this.step, this.min, this.max));
  }

  decrease() {
    this.setValue(this.calcStep(this.value, -this.step, this.min, this.max));
  }
}

export default class CreatQuanyityView {
  constructor(element, options) {
    this.options = options || OPTIONS;
    this.quantity = new CreateQuantity(this.options);

    this._listeners = new Listeners();
    this.input = element.querySelector(SELECTORS_QUANTITY.INPUT);

    this.decrease = element.querySelector(SELECTORS_QUANTITY.DECREASE);
    this.increase = element.querySelector(SELECTORS_QUANTITY.INCREASE);
    this.changeInput = new CustomEvent('change', {bubbles: true});

    this.render();

    this._listeners.add(this.input, 'change', this.onInput.bind(this));
    this._listeners.add(this.decrease, 'click', this.onDecrease.bind(this));
    this._listeners.add(this.increase, 'click', this.onIncrease.bind(this));
    this._listeners.add(this.quantity, 'change', this.render.bind(this));
  }

  render() {
    const value = this.quantity.getValue();
    this.input.step = this.options.step || OPTIONS.step;
    this.input.min = this.options.min || OPTIONS.min;
    this.input.max = this.options.max || OPTIONS.max;
    this.input.value = value;
    this.decrease.disabled = value <= (this.options.min || OPTIONS.min);
    this.increase.disabled = value >= (this.options.max || OPTIONS.max);
  }

  onDecrease() {
    this.quantity.decrease();
    this.input.dispatchEvent(this.changeInput);
  }

  onIncrease() {
    this.quantity.increase();
    this.input.dispatchEvent(this.changeInput);
  }

  onInput(event) {
    this.quantity.setValue(event.target.value);
  }

  destroy() {
    this._listeners.removeAll();
  }
}
