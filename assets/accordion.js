"use strict";

class Accordion {
  constructor(domNode) {
    this.buttonEl = domNode;

    const controlsId = this.buttonEl.getAttribute("aria-controls");
    this.contentEl = document.getElementById(controlsId);

    this.open = this.buttonEl.getAttribute("aria-expanded") === "true";

    if (this.open) {
      this.contentEl.tabIndex = 0;
    }

    this.buttonEl.addEventListener("click", this.onButtonClick.bind(this));
  }

  onButtonClick() {
    this.toggle(!this.open);
  }

  toggle(open) {
    if (open === this.open) {
      return;
    }

    this.open = open;

    this.buttonEl.setAttribute("aria-expanded", `${open}`);

    if (open) {
      this.contentEl.classList.remove("accordion-hidden");
      this.contentEl.tabIndex = 0;
    } else {
      this.contentEl.classList.add("accordion-hidden");
      this.contentEl.tabIndex = -1;
    }
  }
}

const accordions = document.querySelectorAll("[data-accordion-button]");
accordions.forEach((accordionEl) => {
  new Accordion(accordionEl);
});
