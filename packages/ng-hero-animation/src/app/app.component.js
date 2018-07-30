const template = `
<style>

.hero-animation {
    position: absolute;
    transform-style: preserve-3d;
    transition: opacity ease-in-out 500ms;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.hero-animation.ng-enter, .hero-animation.ng-leave.ng-leave-active {
    opacity: 0;
}
.hero-animation.ng-enter.ng-enter-active {
    opacity: 1;
}
.hero-animation__animator {
    transform-style: preserve-3d;
    transition: all ease-in-out 500ms;
    position: absolute;
    z-index: 10000;
}
.modal {
    z-index: 20;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    background-color: #eeeeee;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    box-shadow: 0 5px 30px 0 rgba(97,97,97,1);
}
.backdrop-modal {
    z-index: 15;
    background-color: rgba(0,0,0,.3);
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
}
.modal.ng-enter {
  transition: opacity 500ms ease-out;
  opacity: 0;
}
.modal.ng-enter.ng-enter-active {
  opacity: 1;
}
.modal.ng-leave {
  transition: opacity 500ms ease-out;
  opacity: 1;
}
.modal.ng-leave.ng-leave-active {
  opacity: 0;
}
</style>
<main>
  <header>
    <nav>
      <a ng-repeat="link in $ctrl.links" ui-sref="{{link.state}}">{{link.label}}</a>
      <a ng-click="$ctrl.showModal()">Show Modal</a>
    </nav>
  </header>
  <div ui-view class="hero-animation"></div>
</main>
`;

const modalTemplate = `
  <div class="modal hero-animation">
    <div class="polymer--modal" hero-id="modal"></div>
    <span ng-click="$ctrl.modalClose()">close</span>
  </div>
  <div class="backdrop-modal"></div>
`;


class Controller {
  static get $inject() {
    return ['ModalService'];
  }

  constructor(ModalService) {
    this.modalService = ModalService;
  }

  $onInit() {
    this.links = [
      {state: 'moduleOne', label: 'One'},
      {state: 'moduleTwo', label: 'Two'},
      {state: 'moduleThree', label: 'Three'},
    ];
  }

  showModal() {
    this.modal = this.modalService.showModal({
        template: modalTemplate,
        controller: 'ModalController as $ctrl',
      })
      .then((modal) => modal.close)
      .then(() => this.modal = null);
  }
}

export default {
  template,
  controller: Controller,
}
