# fongandrew:materialize-modals
This package contains drop-in replacements for the accounts-ui new password
and email verification modals. They are styled using Materialize.css's 
modal functionality.

Installation
------------
`meteor add fongandrew:materialize-modals`

Materialize.css is required. The easiest way to include it is to install the 
[materialize:materialize](https://atmospherejs.com/materialize/materialize)
package. This package is not directly required by this one though, so as to
accomodate different preferences on how to include materialize.css (e.g. 
using SASS files vs. the compiled CSS). The easiest way to 

Usage
-----
Call `LoginModals.init()` in top-level client-side code (e.g. not
in a Meteor.startup block).

