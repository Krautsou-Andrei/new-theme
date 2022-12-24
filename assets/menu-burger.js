"use strict";

class MenuBurger {
  constructor(domNode) {
    this.element = domNode;
    this.button = this.element.querySelector("[data-menu-burger-button]");
    this.menu = this.element.querySelector("[data-menu-burger]");

    this.open = this.button.getAttribute("aria-expanded") === "true";

    this.focusableEls = this.element.querySelectorAll("[data-menu-burger-link]");
    this.firstFocusableEl = this.button;
    this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
    this.KEYCODE_TAB = 9;
    this.KEYCODE_ESCAPE = 27;

    this.button.addEventListener("click", this.onButtonClick.bind(this));
    this.menu.addEventListener("click", this.menuPressMouseDown.bind(this));

    this.trapFocus();
  }

  onButtonClick() {
    this.menu.classList.toggle("active");
    this.button.firstElementChild.classList.toggle("active");

    let menuClassName = this.menu.className;

    if (menuClassName.match(/active/)) {
      this.menu.removeAttribute("inert", "");
    } else {
      this.menu.setAttribute("inert", "");
    }

    this.toggle(!this.open);
  }

  trapFocus() {
    this.element.addEventListener("keydown", this.pressKey);
  }

  menuPressMouseDown() {
    this.firstFocusableEl.focus();
  }

  toggle(open) {
    if (open === this.open) {
      return;
    }

    this.open = open;

    this.button.setAttribute("aria-expanded", `${open}`);
  }

  pressKey = (e) => {
    const isTabPressed = e.key === "Tab" || e.keyCode === this.KEYCODE_TAB;
    const isEscapePressed = e.key === "Escape" || e.keyCode === this.KEYCODE_ESCAPE;

    if (isEscapePressed) {
      this.onButtonClick();
      this.button.focus();
    }

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableEl && this.open) {
        this.lastFocusableEl.focus();
        console.log(this.lastFocusableEl);
        e.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusableEl) {
        this.firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  };
}

const menuBurgerWrap = document.querySelector("[data-menu-burger-wrap]");
new MenuBurger(menuBurgerWrap);
