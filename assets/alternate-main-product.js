"use strict";
// window.customElements.define(
//   "custom-element",
//   class extends HTMLElement {
//     constructor() {
//       super();
//       console.log("custom-element loaded");
//     }

//     select() {
//       console.log(this);
//     }
//   }
// );

const SELECTORS = {
  ACCORDION: "[data-accordion]",
  SECTION: "[data-accordion-section]",
  BUTTON: "[data-accordion-button]",
  CONTENT: "[data-accordion-content]",
};

const STATES_SECTION = {
  OPENED: "opened",
  ANIMATED: "animated",
  CLOSED: "closed",
};

const ACCORDION_CONFIG = {
  alwaysOpenOne: true,
  openSection: [1],
};

const ANIMATION_CONFIG = {
  duration: 500,
  easing: "ease-out",
  fill: "forwards",
};

class Collapse {
  constructor(node) {
    this.element = node;
    this.button = this.element.querySelector(SELECTORS.BUTTON);
    this.content = this.element.querySelector(SELECTORS.CONTENT);

    this.state = STATES_SECTION.CLOSED;

    this.animation = null;

    this.button.addEventListener("click", this.toggle.bind(this));
  }

  toggle() {
    switch (this.state) {
      case STATES_SECTION.CLOSED:
        this.opened();
        break;
      case STATES_SECTION.OPENED:
        this.closed();
        break;
      default:
        return;
    }
  }
  closed() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(false, STATES_SECTION.CLOSED);
    this.button.setAttribute("aria-expanded", false);
    this.content.tabIndex = -1;
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute("aria-expanded", true);
    this.content.tabIndex = 0;
  }

  _animateContent(reverse, endState) {
    const config = ANIMATION_CONFIG;
    config.direction = reverse ? "reverse" : "normal";

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.content.animate(
      {
        minHeight: [`${this.content.scrollHeight}px`, "0px"],
        height: ["auto", "0px"],
        overflow: ["visible", "hidden"],
      },
      config
    );
    this.animation.addEventListener("finish", () => {
      this.animation = null;
      this.state = endState;
    });
  }
}

class Accordion {
  constructor(node, config) {
    this.sections = node.querySelectorAll(SELECTORS.SECTION);
    this.sectionsInit = [];
    this.alwaysOpenOne = config.alwaysOpenOne;
    this.openSection = config.openSection;
    this.init();
  }

  init() {
    this.sections.forEach((element) => {
      const section = new Collapse(element);
      this.sectionsInit.push(section);

      if (this.alwaysOpenOne) {
        section.button.addEventListener("click", (event) => {
          this.closedSections(event.target.id);
        });
      }
    });

    // this.startOpenSection();
  }

  startOpenSection() {
    this.openSection = this.openSection.splice(0, this.sectionsInit.length);
    if (!this.alwaysOpenOne) {
      this.openSection.forEach((index) => {
        if (index > 0 && index <= this.sectionsInit.length) {
          this.sectionsInit[index - 1].toggle();
        }
      });
    } else if (this.openSection[0] > 0 && this.openSection[0] <= this.sectionsInit.length) {
      this.sectionsInit[this.openSection[0] - 1].toggle();
    }
  }

  closedSections(id) {
    this.sectionsInit.forEach((section) => {
      if (section.button.id !== id && section.state === STATES_SECTION.OPENED) {
        section.toggle();
      }
    });
  }
}

Shopify.theme.sections.register("alternate-main-product", {
  customElement: null,

  onLoad: function () {
    this.accordeon = new Accordion(this.container, ACCORDION_CONFIG);
  },

  onUnload: function () {},

  onSelect: function () {},

  onDeselect: function () {},

  onBlockSelect: function (event) {
    this.accordeon.sectionsInit.forEach((section) => {
      if (section.element.id === event.target.id) {
        section.opened();
      }
    });
  },

  onBlockDeselect: function (event) {
    this.accordeon.sectionsInit.forEach((section) => {
      if (section.element.id === event.target.id) {
        section.closed();
      }
    });
  },
});
