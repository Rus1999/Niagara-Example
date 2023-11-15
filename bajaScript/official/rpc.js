// use RPC mechanism to invoke Java methods on the Server.

// to implement an RPC, annotate one of Java methods with @NiagaraRpc annotation
// you may additonally specify permission requirements for a user to be able to call the RPC method.
// BajaScript will make asynchronous network call, call the specified Java method on the server and resolve the result.

require(['baja!', 'dialogs'], (baja, dialogs) => {
  'use strict';

  // first resolve an instance of docDeveloper:BajaScriptTestComp
  // this class has a Java method named hello() that is annotate with @NiagaraRPC.
  baja.Ord.make('station:|slot:/BajaScriptExamples/Components/BajaScriptTestComp')
    .get()
    .then((comp) => {
      // invoke the Java method hello() on this component in the server and show the response.
      return comp.rpc('hello', 'Rus');
    })
    .then((response) => {
      dialogs.showOk(response);
    })
    .catch((err) => baja.error(err));
})