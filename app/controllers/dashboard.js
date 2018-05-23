import Controller from '@ember/controller';

export default Controller.extend({
  // bank: service(), // get fake data
  init() {
    this._super(...arguments);


    // banking data
    this.set('balance', this.bankBalance());
  },
  bankBalance() {
    // randomly generate bank account balance
    return "$" + Math.floor((Math.random() + 1) * 10000) + ".00";
  }
});
