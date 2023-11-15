require([ 'baja!', 'baja!control:NumericOverride', 'dialogs' ], (baja, types, dialogs) => {
    "use strict";

    const sub = new baja.Subscriber();

    dialogs.showOk({
      content: (dlg, jq) => {
        jq.text("Waiting for change...");

        return baja.Ord.make("station:|slot:/BajaScriptExamples/Components/NumericWritable")
          .get({ subscriber: sub })
          .then((point) => {
            // The Promise returned from get() resolves after the ORD resolves to the point and it has been ssubscribed.
            // After that the following .then() handler will run

            // Invoking the 'override' Action on a point requires an argument.
            // First create a control:NumericOverride object.
            // to create instance of Baja type (via baja.$ method) we must import Type itself first
            // which is done by using the baja! plugin in require ()
            const overrideVal = baja.$("control:NumericOverride", {
              value: 777,
              duration: baja.RelTime.make({ seconds: 5 })
            });

            sub.attach("changed", function (property, cx) {
              if (property.getName() === "out") {
                jq.text("Out: " + point.getOutDisplay());
              }
            });

            // Invoke the Action on the point. This will result in an asynchronouss network call.
            return point.invoke({
              slot: 'override',
              value: overrideVal
            });
          });
      }
    })
      .promise()
      .catch((err) => baja.error(err))
      .finally(function () {
        sub.unsubsribeAll();
        sub.detach();
      })
})