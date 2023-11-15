// set properties
// then() is use to make sure that the code is running or excuting in correct order 

require(['baja!', 'dialogs'], (baja, dialogs) => {
  'use strict';

  let counter;
  baja.Ord.make('station:|slot:/BajaScriptExamples/Components/Counter')
    .get({
      lease: true, // temporarily subscribe the counter for one minute
      leaseTime: baja.RelTime.make({ minutes: 1 })
    })
    .then((point) => {
      counter = point;
      // all of the calls return a promise.
      // next then() will only invoked only after the promise returned from the preceding one has resolved.
      // In the case of a dialog, the promise is resolved once the dialog has closed
      return dialogs.showOk('Counter before setting: ' + counter.getOutDisplay()).promise();
    })
    .then(() => {
      return counter.getCountUp().setValue(true);
    })
    .then(() => {
      // as soon as the property has been set to true, change it back to false.
      return counter.getCountUp().setValue(false);
    })
    .then(() => {
      return dialogs.showOk('Counter after setting: ' + counter.getOutDisplay()).promise();
    })
    .catch((err) => {
      // it's important that a promise is always returned.
      // but when a returned promise won't be handled (here, require js won't know what to do with it) then be sure to add a .catch() so any errors will be handled or at least be logged
      baja.error(err);
    });
});