// while we can reading live values and ilnvoking action, we an also manipulate the component running in a station. for instance we can add, remove, reorder or rename information.

require(['baja!', 'baja!alarm:AlarmSourceExt,alarm:OutOfRangeFaultAlgorithm,alarm:OutOfRangeAlgorithm','dialogs'], function (baja, types, dialogs) {
  "use strict";

  // resloveing an ORD without specifying a subscriber without any arguments in the get() method,
  // the counter component will be 'leased' when a component is leased, it is temporarily subscribe for the default lease time (10s)
  // lease time can be specify by passing leaseTime property to the get() method.
  baja.Ord.make('station:|slot:/BajaScriptExamples/Components/Ramp')
    .get()
    .then((point) => {
      // check if alarm extension is added to it?
      // //console.log(point.getSlots().is('alarm:AlarmSourceExt').isEmpty());
      if (!point.getSlots().is('alarm:AlarmSourceExt').isEmpty()) {
        dialogs.showOk('Alarm extension already added to point!');
        return;
      }

      // create an instance of a out of range alarm extension. (must import the type first)
      // import using baja! pulgin in the require() call.
      // we can also import types using the baja.importTypes() function.
      // if the types were not already imported, baja.$() would throw an error.

      // when creating an instance of a complex, 
      const ext = baja.$('alarm:AlarmSourceExt', {
        // specify its properties using an object literal as second argument to baja.$().
        faultAlgorithm: baja.$('alarm:OutOfRangeFaultAlgorithm'),
        offnormalAlgorithm: baja.$('alarm:OutOfRangeAlgorithm')
      });

      // at this point we have an alarm extension in memory in the client. (Not add it yet)
      // we can configure a few properties on the arlm extension first.
      const offNormal = ext.getOffnormalAlgorithm();
      offNormal.setHighLimit(80);
      offNormal.setLowLimit(20);
      offNormal.getLimitEnable().setLowLimitEnable(true);
      offNormal.getLimitEnable().setHighLimitEnable(true);

      // now add the extension to the point. (Point is the proxy version of the real component running in the station.)
      // when we call 'add', this will make a network call to add the Alarm Extension to the real component running in the station. If the current user doesn't have permission to add the extension to the point, this operation will fail.
      return point.add({
        slot: 'alarmExt?', // ? is used to gurantee a unique name is given to the new slot.
        value: ext
      })
        .then(() => {
          // after successfully added extension
          dialogs.showOk('Added alarm extension to ' + point.getNavOrd().toString());
        })
        .catch((err) => {
          // if any error occurs then
          dialogs.showOk('Error adding extension to point: ' + err);
        });
    })
    .catch((err) => baja.error(err));
})