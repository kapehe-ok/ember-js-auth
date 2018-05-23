import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  auth: service(),
  init() {
    this._super(...arguments);
    this.set('isAuthenticated', this.get('auth').isAuthenticated);
    this.get('auth').getUserInfo().then(user => this.set('user', user));
  }
});