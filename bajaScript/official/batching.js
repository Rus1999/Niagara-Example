// most of network requests will batch together automaticllyt as needed. manual batching is largely obsolete.
// request can still be manually batched together into single network call if desired.

require(
  ['baja!', 'baja!control:NumericWritable', 'dialogs', 'jquery', 'Promise', 'underscore', 'nmodule/webEditors/rc/fe/feDialogs' ], 
  (baja, types, dialogs, $, Promise, _, feDialogs) => {
  
    'use strict';

    // user input
    feDialogs.showFor({
      title: 'Enter a number...',
      value: 1,
      buttons: [ 'ok' ]
    }) // after click ok button then pass the value to continue
      // value of the previous promise have benn pass here
      .then((value) => {
        const sub = new baja.Subscriber();
      
        // invoke actions on some points in batch and listen for any changes.
        return dialogs.showOk((dlg, jq) => {
      
          const log = (str) => {
            jq.append($('<div></div>').text(str));
          }
      
          // listen for changes
          sub.attach('changed', function () {
            // this callback is a regular function, not an arrow function
            // this is because a subscriber callback sets the function context (therefore the value of 'this') to the component that fired the event.
            // this = the component that run this event.
            const point = this;
            log(point.toPathString() + ' -> ' + point.getOutDisplay());
            // // log(point.getFallback());
          });
      
          return baja.Ord.make('station:|slot:/BajaScriptExamples/Components/Batch')
            .get()
            .then((folder) => {
              const batch = new baja.comm.Batch();
              const points = folder.getSlots().is('control:NumericWritable').toValueArray();
              // //console.log(folder.getSlots().is('control:NumericWritable').toValueArray());
      
              // log every point name
              log(points.map((p) => p.getName()));
      
              // we are going to gather each promise into an array so that we can pass them to Promise.all(). This way, if an error occurs, we can handle or log it.
              // Note: don't let Promises go unreturned or unhandled
      
              // passing the 'batch' parameter means that these network calls don't go out just yet..
              const promises = points.map((point) => Promise.all([
                sub.subscribe({ comps: point, batch }),
                point.invoke({ slot: 'set', value, batch })
              ]));
      
              // make the network call
              batch.commit();
      
              return Promise.all(promises);
            });
        })
        .promise()
        .finally(() => {
          sub.unsubscribeAll();
          sub.detach();
        });
      })
      .catch((err) => baja.error(err));
});