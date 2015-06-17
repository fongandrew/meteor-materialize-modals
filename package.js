Package.describe({
  name: 'fongandrew:materialize-modals',
  version: '0.1.0',
  summary: 'Account modals that take the place of those provided by ' + 
           'accounts-ui. Uses materialize.css classes.'
});

Package.onUse(function(api) {
  'use strict';
  api.versionsFrom('METEOR@1.1.0.2');
  api.use([
    'fongandrew:spacebars-helpers',
    'fongandrew:save-button',
    'reactive-var',
    'templating'
  ], 'client');
  api.use('accounts-password', ['client', 'server']);
  api.export('LoginModals');
  api.addFiles([
    'modals.html',
    'modals.js'
  ], 'client');
});
