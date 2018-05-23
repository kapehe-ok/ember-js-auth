import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  auth: service('auth'),
  beforeModel() {
    // this is where we check if a user is authenticated
    // if not authenticated, kick them to the home page
    if (!this.auth.isAuthenticated) {
      this.transitionTo('/');
    }
  }
});
