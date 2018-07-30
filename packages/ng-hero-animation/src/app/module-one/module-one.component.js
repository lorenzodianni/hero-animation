const template = `
<div class="view" style="background: palevioletred">
    <h1 class="title--one" hero-id="title">{{$ctrl.title}}</h1>
    <div class="polymer--one" hero-id="polymer"></div>
    <div class="polymer--modal__one" hero-id="modal"></div>
    <div ng-if="!$ctrl.modal" ng-click="$ctrl.showModal()" style="padding-top: 30px">SHOW MODAL</div>
</div>
`;

const modalTemplate = `
  <div class="modal hero-animation">
    <div class="polymer--modal__two" hero-id="modal"></div>
    <span ng-click="$ctrl.modalClose()">close</span>
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
