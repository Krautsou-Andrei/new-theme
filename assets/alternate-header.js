"use strict";

class Quantity {
  constructor(node, event) {
    this.element = node;
    this.quantity = this.element.querySelector("#cart-quantity");

    this.change(event);
  }

  change(event) {
    const parser = new DOMParser();
    const newQuantity = parser.parseFromString(event.detail.header, "text/html");

    this.quantity.innerHTML = newQuantity.getElementById("cart-quantity").innerHTML;
  }
}

Shopify.theme.sections.register("alternate-header", {
  customElement: null,

  onLoad: function () {
    document.addEventListener("card:added", (event) => {
      new Quantity(this.container, event);
    });
  },

  onUnload: function () {
    document.removeEventListener("card:added", (event) => {
      new Quantity(this.container, event);
    });
  },

  onSelect: function () {},

  onDeselect: function () {},

  onBlockSelect: function (event) {},

  onBlockDeselect: function (event) {},
});
