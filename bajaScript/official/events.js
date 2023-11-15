require(['baja!', 'dialogs', 'jquery' ], (baja, dialogs, $) => {
  'use strict';

  const sub = new baja.Subscriber();
  const ordStr = 'station:|slot:/BajaScriptExamples/Components/EventTest';

  dialogs.showOk({
    content: (dlg, jq) => {

      const log = msg => {jq.append($('<div></div>').text(msg))};

      // attching a single event listener function
      /*
      sub.attach('changed', function(prop, cx) {
        update('Property changed: ' + prop.getName());
      }); 
      */

      // attach one function to multiple events
      /*       
      sub.attach('subsribed changed added removed', function() {
        update('Event received: ' + this.toPathString());
      }) 
      */

      log('Open another browser or workbench. navigate to...');
      log('...');
      log(ordStr);
      log('...');
      log('Now add and remove Components to this folder. Note the events that appear below...');
      log('...');

      // use an object literal to define multiple event handlers in onecall
      sub.attach({
        changed                : (prop, cx)           => { log('Changed') },
        added                  : (prop, cx)           => { log('Added') },
        removed                : (prop, val, cx)      => { log('Removed') },
        renamed                : (prop, oldName, cx)  => { log('Renamed') },
        reordered              : (cx)                 => { log('Reordered') },
        topicFired             : (topic, event, cx)   => { log('Topic Fired') },
        flagsChanged           : (slot, cx)           => { log('Floags changed') },
        facetsChanged          : (slot, cx)           => { log("Facets Changed") },
        subscribed             : (cx)                 => { log("Subscribed") },
        unsubscribed           : (cx)                 => { log("Unsubscribed") },
        unmount                : (cx)                 => { log("EventTest removed from Station!") },
        componentRenamed       : (oldName, cx)        => { log("Original EventTest has been renamed: " + oldName) },
        componentFlagsChanged  : (cx)                 => { log("EventTest parent Property flags changed") },
        componentFacetsChanged : (cx)                 => { log("EventTest parent Property facets changed") },
        componentReordered     : (cx)                 => { log("EventTest has been reordered in parent") }
      });
      return baja.Ord.make(ordStr)
        .get({ subscriber: sub });
    }
  })
    .promise()
    .catch((err) => baja.error(err))
    .finally(() => {
      sub.unsubscribeAll();
      sub.detach();
    })
})