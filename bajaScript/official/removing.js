require(['baja!', 'dialogs'], (baja, dialogs) => {
  "use strict";

  baja.Ord.make('station:|slot:/BajaScriptExamples/Components/Ramp')
    .get()
    .then((point) => {
      // check if alarm ext is exists
      const ext = point.getSlots().is('alarm:AlarmSourceExt').firstValue();
      // console.log(ext);

      if (ext) {
        // remove the alarm extension from the point. This will make a network call to the server to remove the extension
        return point.remove(ext)
          .then(() => {
            dialogs.showOk('Removed alarm extension from point: ' + point.getNavOrd().toString());
          });
      } else {
        dialogs.showOk('No alarm extension found.');
      }
    })
    .catch((err) => baja.error(err));
});