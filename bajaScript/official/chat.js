// chat application
// chat to anyone else using this app at the same time
// hit run button to start listenning. enter any message below and hit run to send

// only work with users who are logged onto the same station

require(['baja!', 'bajaux/spandrel', 'bajaux/mixin/subscriberMixIn', 'dialogs', 'nmodule/webEditors/rc/fe/feDialogs'], (baja, spandrel, subscriberMixIn, dialogs, feDialogs) => {
  'use strict';

  const sub= new baja.Subscriber();
  let name;

  // ask the user for thier name.
  feDialogs.showFor({
    title: 'Enter Name',
    value: '',
    properties: { placeholder: 'Enter name here' }
  })
    .then((enteredName) => {
      name = enteredName || 'Unkown';

      // Resolve the chat Component.
      return baja.Ord.make('station:|slot:/BajaScriptExamples/Components/BajaScriptTestComp')
        .get({ subscriber: sub });
    })
    .then((comp) => {
      // show the chat window.
      return dialogs.show({
        title: 'BajaScript Chat - ' + name,
        content: function (dlg, jq) {
          jq.html("Say: <input type='text' size='60' value=''>" +
            "<pre style='border: 1px solid grey'>Welcome to BajaScript Chat...\n</pre>");

            var input = jq.find('input'),
              chat = jq.find('pre');

            // to make this work, a BajaScriptTestComp has a Topic named 'message'. We will use this Topic to send messages back and forth between clients.

            sub.attach('topicFired', function (topic, event, cx) {
              if (topic.getName() === 'message') {
                // when the component in the stastion fires the 'message' topic, add the value to the chat
                chat.text(chat.text() + '\n' + event);
              }
            });

            // when the user hits the enter key, fire the Topic on the Station component
            input.keyup(function (e) {
              if (e.keyCode === 13) {
                comp.fire({
                  slot: 'message',
                  value: name + ' says ' + input.val() // retrieve input value
                })
                  .catch((err) => baja.error(err));
                // clear input box
                input.val('');
              }
            });
          },
          buttons: [ {
            name: 'close',
            displayName: 'Close',
            esc: true
          } ]
      }).promise(); // return a promise for the dialog that will be resolved when the dialog closes. // useful when wanting to use dialogs in a promise chain when creting a ui.
    })
    .catch((err) => baja.error(err))
    .finally(() => {
      sub.unsubscribeAll();
      sub.detach();
    });
});