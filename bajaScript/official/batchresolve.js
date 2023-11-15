// batch resolve multiple of ORDs in one go with a minimal number of network calls.

require(['baja!', 'dialogs'], (baja, dialogs) => {
  'use strict';

  const ords = [
    'station:|slot:/BajaScriptExamples/Components/Ramp',
    'station:|slot:/BajaScriptExamples/Components/Counter',
    'station:|slot:/BajaScriptExamples/Components/NumericWritable',
    'station:|slot:/BajaScriptExamples/Components/Batch',
    'station:|slot:/BajaScriptExamples/Components/EventTest',
    'station:|slot:/BajaScriptExamples/Components/Reorder',
    'station:|slot:/BajaScriptExamples/Components/BajaScriptTestComp',
  ];

  const resolve = new baja.BatchResolve(ords);

  let messages = [];

  const log = str => { messages.push(str); };

  resolve.resolve({
    each: function () {
      log(this.toPathString());
    }
  })
    .then(() => {
      dialogs.showOk({
        content: '<pre>' + messages.join('\n') +  '</pre>'
      });
    })
    .catch((err) => baja.error(err));
});