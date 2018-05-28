import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
  auth: service('auth'),
  beforeModel() {
    const auth = get(this, 'auth');

    auth
      .handleAuthentication() // stores access_token and expires_at in sessionStorage
      .then(() => {
        this.transitionTo('/dashboard');
      });
  },
});