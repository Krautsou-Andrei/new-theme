"use strict";

class Quantity {
  constructor(node, event) {
    this.element = node;
    this.quantity = this.element.querySelectorAll(".cart-preview__quantity");

    this.change(event);
  }

  change(event) {
    const parser = new DOMParser();
    const newQuantity = parser.parseFromString(event.detail.header, "text/html");

    this.quantity.forEach((element) => {
      element.innerHTML = newQuantity.getElementById("cart-quantity").innerHTML;
    });
  }
}

Shopify.theme.sections.register("alternate-header", {
  customElement: null,

  onLoad: function () {
    document.addEventListener("card:added", (event) => {
      new Quantity(this.container, event);
    });
  },

  onUnload: function () {},

  onSelect: function () {},

  onDeselect: function () {},

  onBlockSelect: function (event) {},

  onBlockDeselect: function (event) {},
});
