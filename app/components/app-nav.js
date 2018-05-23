import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service('auth'),
  actions: {
  
    /**
   * From service/auth, starting the login process
   */
    login() {
      this.get('auth').login();
    },
    
    /**
   * From service/auth, removing all the save tokens from the session.
   */
    logout() {
      this.get('auth').logout();
    }
  }
});
