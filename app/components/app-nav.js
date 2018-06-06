import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  auth: service('auth'),
  actions: {
  
    /**
   * From service/auth, starting the login process
   */
    login() {
      this.get('auth').login();
    },

    goHome() {
      this.get('router').transitionTo('home');
    },

    goDashboard() {
      this.get('router').transitionTo('dashboard');
    },
    
    /**
   * From service/auth, removing the saved token from the session.
   */
    logout() {
      this
        .get('auth')
        .logout()  
    }
  }
});
