export default class ModalController {
  static get $inject() {
    return ['close'];
  }

  constructor(close) {
    this.modalClose = close;
  }
}
