/* global LoginModals: true */
LoginModals = {
  // Which modal to show, if any
  modal: new ReactiveVar(),

  // Shortcut to get modal
  get: function() {
    'use strict';
    return this.modal.get();
  },

  // Set the modal to something
  set: function(value) {
    'use strict';

    if (! value) {             // Normalize set falsey to unset
      this.unset();
    }
    else {
      // NB: Not sure if we have to do this
      // 
      // if (this.modal.get()) {  // Modal is already set, close existing first
      //   $('.login-modal').closeModal();
      // }
      this.modal.set(value);
    }
  },

  unset: function() {
    'use strict';

    $('.login-modal').closeModal();
    this.modal.set(null);
  },

  // Done callback for account verification / reset-pw flow                                 
  doneCallback: null,

  // Most recent token to pass to Meteor's account functions
  token: null,

  // Resets Password
  resetPassword: function(newPassword) {
    'use strict';
    var self = this;
    Accounts.resetPassword(self.token, newPassword, function(err) {
      if (err) {
        console.error(err);
        self.set('_invalidLink');
      } else {
        self.doneCallback();
        self.set('_successPwChanged');
      }
    });
  },

  // Call this in main app code to set up account verification
  init: function() {
    'use strict';
    var self = this;

    var callbackFor = function(template) {
      return function(token, done) {
        self.token = token;
        self.doneCallback = done;
        self.set(template);
      };
    };

    Accounts.onResetPasswordLink(callbackFor('_resetPasswordLink'));
    Accounts.onEnrollmentLink(callbackFor('_enrollmentLink'));

    Accounts.onEmailVerificationLink(function(token, done) {
      Accounts.verifyEmail(token, function(err) {
        if (err) {
          console.error(err);
          self.modal.set('_invalidLink');
        } else {
          done();
          self.modal.set('_emailVerificationLink');
        }
      });
    });
  }
};

(function() {
  'use strict';

  Template._loginModals.helpers({
    modal: function() {
      return LoginModals.get();
    }
  });

  var noticeModal = function(template) {
    template.onRendered(function() {
      this.$('.modal').openModal({
        complete: function() {
          LoginModals.unset();
        }
      });
    });

    template.helpers({
      // Returns name of who we'll be logged in as (if applicable)
      displayName: function() {
        var user = Meteor.user();
        if (user && user.emails && user.emails[0] && user.emails[0].address) {
          return user.emails[0].address;
        }
      }
    });
  };

  noticeModal(Template._emailVerificationLink);
  noticeModal(Template._invalidLink);
  noticeModal(Template._successPwChanged);

  ////////

  Template._resetPasswordLink.onCreated(function() {
    this._saving = new ReactiveVar(false);
    this._error = new ReactiveVar(false);
  });

  Template._resetPasswordLink.helpers({
    saving: function() {
      return Template.instance()._saving.get();
    },

    error: function() {
      return Template.instance()._error.get();
    }
  });

  Template._resetPasswordLink.onRendered(function() {
    this.$('.modal').openModal({
      dismissible: false
    });

    Meteor.setTimeout(function() {
      $('#password').focus();
    }, 500);
  });

  Template._resetPasswordLink.events({
    'submit': function(e, template) {
      e.preventDefault();
      var newPassword = $(e.target).find('[name=password]').val();
      if (newPassword) {
        template._saving.set(true);

        // By default, we use Meteor's default resetPassword code, but you can 
        // override this by passing a resetPasswordFunc variable into the data 
        // context. Will be called with LoginModals as 'this'
        var resetPasswordFunc = (this.resetPasswordFunc || 
                                 LoginModals.resetPassword);
        resetPasswordFunc.call(LoginModals, newPassword);  
      } else {
        template._error.set(true);
      }
    }
  });

})();