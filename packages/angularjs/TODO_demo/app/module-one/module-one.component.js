const template = `
<div class="view" style="background: palevioletred">
    <a ng-click="$ctrl.showModal()">Show Modal</a>
    <h1 class="title--one" hero-id="title">{{$ctrl.title}}</h1>
    <div class="polymer--one" hero-id="polymer"></div>
    <div class="polymer--modal__view" hero-id="modal"></div>
</div>
`;

class Controller {
  static get $inject() {
    return ['ModalService'];
  }

  constructor(ModalService) {
    this.modalService = ModalService;
  }

  $onInit() {
    this.title = 'One!';
  }

  showModal() {
    this.modal = this.modalService.showModal({
        template: `
          <div class="modal hero-animation">
            <div class="polymer--modal" hero-id="modal"></div>
            <span ng-click="$ctrl.modalClose()">close</span>
          </div>
          <div class="backdrop-modal"></div>
        `,
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
