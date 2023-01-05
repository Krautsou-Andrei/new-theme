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
    this.toggle = this.toggle.bind(this);

    this.button.addEventListener('click', this.toggle);
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

  closed() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(false, STATES_SECTION.CLOSED);
    this.button.setAttribute('aria-expanded', false);
    // this.content.tabIndex = -1;
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute('aria-expanded', true);
    // this.content.tabIndex = 0;
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

  destroy() {
    this.button.removeEventListener('click', this.toggle);
  }
}

export default class Accordion {
  constructor(node) {
    this.accordion = node.querySelector(SELECTORS.ACCORDION);
    this.sections = this.accordion.querySelectorAll(SELECTORS.SECTION);
    this.sectionsInit = [];
    this.alwaysOpenOne = this.accordion.getAttribute(SELECTORS.ALWAYS_OPEN_ONE);

    this.init();
    console.log('this.alwaysOpenOne', typeof this.alwaysOpenOne);
  }

  init() {
    this.sections.forEach((element) => {
      const section = new Collapse(element);
      this.sectionsInit.push(section);

      this.closedSections = this.closedSections.bind(this);
      if (this.alwaysOpenOne === 'true') {
        section.button.addEventListener('click', this.closedSections);
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
        console.log('false', section.showInLoadSection);
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
    this.sectionsInit.forEach((element) => {
      element.button.removeEventListener('click', this.closedSections);
      element.destroy();
    });
  }
}
