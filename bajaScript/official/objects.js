require([ 'baja!', 'baja!baja:CategoryMask,baja:Weekday', 'dialogs' ], (baja, types, dialogs) => {
  'use strict';

  const messages = [];

  const log = str => { messages.push(str);}

  // string
  log('The type of this is: '.getType());

  // number
  log((12.2).getType());
  log(baja.Double.make(12.3).getType());
  log(baja.Integer.make(12).getType());
  log(baja.Long.make(14).getType());
  log(baja.Float.make(12.4).getType());

  // boolean
  log(true.getType());

  // simples that don't exist
  log('What about unsupported Simples?');
  log('BajaScript hasn\'t got an implementation for all Simples.');
  log('For now, any unknown Simple falls back to a baja.DefaultSimple');
  const categoryMask = baja.$('baja:CategoryMask').make('12');
  log('For example, here\'s a CategoryMask constructor: ' + categoryMask.constructor.name);
  log('and its string encoding: ' + categoryMask.encodeToString());

  // facets
  const facets = baja.Facets.make({
    trueText: 'some true text',
    falseText: 'some false text'
  });

  // encode to string and print out
  const encodedFacetsStr = facets.encodeToString();
  log('Some encoded Facets: ' + encodedFacetsStr);

  // relative time
  log('Milliseconds: ' + baja.RelTime.make({
    hours: 1,
    minutes: 2,
    seconds: 20
  }));

  // absolute time
  log('Time now: ' + baja.AbsTime.now());

  // enums
  log(baja.$('baja:Weekday').get('monday'));


  // custom
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;
  log(`Today date: ${currentDate}`);

  // status
  // make the current status to current down and fault
  const status = baja.Status.make(baja.Status.DOWN | baja.Status.FAULT | baja.Status.ALARM | baja.Status.UNACKED_ALARM);
  log('Status down       : ' + status.isDown());
  log('Status fault      : ' + status.isFault());
  log('Status alarm      : ' + status.isAlarm());
  log('Status unacked    : ' + status.isUnackedAlarm());

  // decode from string and print out
  // facets should be decoded in an asynchronous fashion to ensure the need types have been loaded
  baja.Facets.DEFAULT.decodeAsync(encodedFacetsStr)
    .then((facets) => {
      log('let\'s print out the Facets...');
      facets.getKeys().forEach((key) => {
        log(`key: ${ key }, value: ${ facets.get(key) }`);
      });

      dialogs.showOk({
        content: '<pre>' + messages.join('\n') + '</pre>'
      });
    })
    .catch((err) => baja.error(err));

});