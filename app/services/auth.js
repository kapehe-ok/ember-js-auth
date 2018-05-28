import Service from '@ember/service';
import { computed, get } from '@ember/object';
import config from 'ember-js-auth/config/environment';
import { isPresent } from '@ember/utils';

export default Service.extend({

  /**
   * Configure our auth0 instance
   */
  auth0: computed(function () {
    return new auth0.WebAuth({
      // setting up the config file will be covered below
      domain: config.auth0.domain, // domain from auth0
      clientID: config.auth0.clientId, // clientId from auth0
      redirectUri: 'http://localhost:4200/callback',
      audience: `https://${config.auth0.domain}/userinfo`,
      responseType: 'token',
      scope: 'openid profile' // adding profile because we want username, given_name, etc
    });
  }),

  /**
   * Send a user over to the hosted auth0 login page
   */
  login() {
    get(this, 'auth0').authorize();

  },

  /**
   * When a user lands back on our application
   * Parse the hash and store access_token and expires_at in sessionStorage
   */
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.get('auth0').parseHash((err, authResult) => {
        if (authResult && authResult.accessToken) {

          // store magic stuff into sessionStorage
          this.setSession(authResult);
        } else if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  },

  /**
   * Use our access_token to hit the auth0 API to get a user's information
   * If you want more information, add to the scopes when configuring auth.WebAuth({ })
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) return reject();

      return this
        .get('auth0')
        .client
        .userInfo(accessToken, (err, profile) => resolve(profile))
    });
  },

  /**
   * Computed to tell if a user is logged in or not
   * @return boolean
   */
  isAuthenticated: computed(function() {
    return isPresent(this.getSession().access_token) && this.isNotExpired();
  }),

  /**
   * Returns all necessary authentication parts
   */
  getSession() {
    return {
      access_token: sessionStorage.getItem('access_token'),
      expires_at: sessionStorage.getItem('expires_at')
    };
  },

  /**
   * Store everything we need in sessionStorage to authenticate this user
   */
  setSession(authResult) {
    if (authResult && authResult.accessToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      sessionStorage.setItem('access_token', authResult.accessToken);
      sessionStorage.setItem('expires_at', expiresAt);
      window.location.replace('/dashboard')
    }
  },

  /**
   * Get rid of everything in sessionStorage that identifies this user
   */
  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('expires_at');
    window.location.replace('/')
  },

  /**
   * Check whether the current time is past the access token's expiry time
   */
  isNotExpired() {
    const expiresAt = this.getSession().expires_at;
    return new Date().getTime() < expiresAt;
  }
});
