require(["baja!", "dialogs", "jquery"], (baja, dialogs, $) => {
  "use strict";

  const sub = new baja.Subscriber();

  // ok dialogs with function (called when dialog is about to show)
  dialogs
    .showOk((dlg, jq) => {
      // dlg: dialog instance
      // jq: jQuery wrapper around the dialog's content DOM element

      // inner text of dialog's DOM element is updated using jQuery's text method. Which prevents XSS attacks.
      jq.text("Loading...");

      // update dialog content
      const update = (ramp) => {
        // the ramp's getOutDisplay method is auto-generated by BajaScript based upon the frozen slots a ramp has.
        // getSlotName();
        // each property has a getter and setter method (i.e. getOut and setOut)
        // can use toString(Context) method on the given value
        jq.text(ramp.getOutDisplay());
      }

      // Called whenever the Ramp changes.
      // listener method attached to the subscriber is called when one of the ramp's properties changes. 
      sub.attach("changed", function (prop) {
        // If the property that change is the out slot, it will updated the dialog with the current display value. 
        if (prop.getName() === "out") {
          // 'this' refers to the proxy component instance (browser).
          update(this);
        }
      });

      // ORD is used to resolve and subscribe the Ramp component on the station
      // by create a proxy version of the Ramp component in the browser proxy version has all slots the java based version that running on the station also receive events for any changed property values.
      baja.Ord.make("station:|slot:/BajaScriptExamples/Components/Ramp")
        .get({ subscriber: sub })
        // once the ORD has been resolved, the 'update' method is called.
        // It work this way, first load the dialog with the ramp's current value, and the subscriber keeps it up to date whenever it changes.
        .then(update);
    })
    .promise()
    // when dialog is closed the 'finally' method is called
    .finally(function () {
      // Called when the dialog is closed.
      // stops listening for events from the ramp.
      sub.unsubscribeAll();
      // detaches all listeners from the subscriber. this is best practice for avoiding memory leaks.
      sub.detach();
    });
});
