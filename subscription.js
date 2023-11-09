require(['baja!', 'dialogs' ], (baja, dialogs) => {
  "use strict";

  // subscriber
  const sub = new baja.Subscriber();

  dialogs.showOk({
    title: 'Ramp',
    content: (dlg, jq) => {
      jq.text("Loading...");

      // The 'update' method is called whenever the text needs to be updated.
      const update = (point) => { // declare
        // //console.log(ramp.getOutDisplay())
        // ramp.getOutDisplay() == value of 'out' slot
        jq.text(point.getOutDisplay());
      }

      // called whenever the ramp changes.
      // add 'changed' event listener 
      // when 'changed' run function with property as an agrument
      sub.attach('changed', function(property) {
        // //console.log(property.getName());
        // property.getName return name of slot that has been updated
        if (property.getName() === 'out') { update(this); }
      });

      // resolve the ORD to the Ramp and update the text.
      baja.Ord.make('station:|slot:/BajaScriptExamples/Components/Ramp').get({ subscriber: sub })
        .then((ramp) => {
          // updated once to capture the initial value. the subscriber will continue to updated as the value changes.
          update(ramp);
        })
        .catch((err) => baja.error(err));
    }
  })

  // a promise use to handle asynchronous events in javascript
  .promise()
  .finally(() => {
    // called when the dialog is closed.

    // unsubscribe the component so we're no longer listening to live events.
    sub.unsubscribeAll();

    // detach all subscription handlers to ensure we don't unncessarily  create memory leaks
    sub.detach();
  })
});