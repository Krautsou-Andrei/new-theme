import Listeners from './listeners';

const SELECTORS = {
  ACCORDION: '[data-accordion]',
  BUTTON: '[data-accordion-button]',
  CONTENT: '[data-accordion-content]',
  SECTION: '[data-accordion-section]',
  SHOW_IN_LOAD_SECTION: 'data-show-in-load-section',
  ALWAYS_OPEN_ONE: 'data-always-open-one',
};

const STATES_SECTION = {
  ANIMATED: 'animated',
  CLOSED: 'closed',
  OPENED: 'opened',
};

const ANIMATION_CONFIG = {
  duration: 500,
  easing: 'ease-in-out',
  fill: 'forwards',
};

class Collapse {
  constructor(node) {
    this.element = node;
    this.button = this.element.querySelector(SELECTORS.BUTTON);
    this.content = this.element.querySelector(SELECTORS.CONTENT);
    this.showInLoadSection = this.button.getAttribute(
      SELECTORS.SHOW_IN_LOAD_SECTION,
    );

    this.state = STATES_SECTION.OPENED;

    this.animation = null;

    this.toggle();

    this._listeners = new Listeners();
    this._listeners.add(this.button, 'click', this.toggle.bind(this));
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
    }
  }

  getListeners() {
    return (this.listenrs = this._listeners);
  }

  closed() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(false, STATES_SECTION.CLOSED);
    this.button.setAttribute('aria-expanded', false);
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute('aria-expanded', true);
  }

  destroy() {
    this._listeners.removeAll();
  }

  _animateContent(reverse, endState) {
    const config = ANIMATION_CONFIG;
    config.direction = reverse ? 'reverse' : 'normal';

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.content.animate(
      {
        minHeight: [`${this.content.scrollHeight}px`, '0px'],
        height: ['auto', '0px'],
        overflow: ['visible', 'hidden'],
      },
      config,
    );

    this.animation.addEventListener('finish', () => {
      this.animation = null;
      this.state = endState;
    });
  }
}

export default class Accordion {
  constructor(node) {
    this.accordion = node.querySelector(SELECTORS.ACCORDION);
    this.sections = this.accordion.querySelectorAll(SELECTORS.SECTION);
    this.sectionsInit = [];
    this._listeners = new Listeners();
    this.alwaysOpenOne = this.accordion.getAttribute(SELECTORS.ALWAYS_OPEN_ONE);

    this.init();
  }

  init() {
    this.sections.forEach((element) => {
      const section = new Collapse(element);
      this.sectionsInit.push(section);

      this.closedSections = this.closedSections.bind(this);
      if (this.alwaysOpenOne === 'true') {
        this._listeners.add(
          section.button,
          'click',
          this.closedSections.bind(this),
        );
      }
    });

    this.startOpenSection();
  }

  startOpenSection() {
    let count = 0;
    if (this.alwaysOpenOne !== 'true') {
      this.sectionsInit.forEach((section) => {
        if (section.showInLoadSection === 'true') {
          section.opened();
        }
      });
    } else {
      this.sectionsInit.forEach((section) => {
        if (section.showInLoadSection === 'true' && count <= 0) {
          count++;
          section.opened();
        }
      });
    }
  }

  closedSections(event) {
    const id = event.target.id;
    this.sectionsInit.forEach((section) => {
      if (section.button.id !== id && section.state === STATES_SECTION.OPENED) {
        section.toggle();
      }
    });
  }

  destroy() {
    this._listeners.removeAll();
    this.sectionsInit.forEach((element) => {
      element.getListeners().removeAll();
    });
  }
}
