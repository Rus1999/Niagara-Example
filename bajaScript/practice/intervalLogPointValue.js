require(['baja!'], (baja) => {
  const sub = new baja.Subscriber();
  
  const update = point => { console.log('Point: ' + point.getOutDisplay()); }
  
  sub.attach('changed', function (prop) {
    if (prop.getName() === 'out') { update(this); }
  });

  return baja.Ord.make('station:|slot:/MSSQL/Temp').get({ subscriber: sub })
    .then((point) => {
      setInterval( () => { update(point) }, 2000);
    })
    .catch((error) => console.log(error))
    .finally(() => {
      // Called when the dialog is closed.

      // Unsubscribe the Component so we're no longer listening to live
      // events.
      sub.unsubscribeAll();

      // Detach all subscription handlers to ensure we don't unnecessarily
      // create memory leaks.
      sub.detach();
    });

})

// from NF23 connecting the world
require(['baja!', 'asyncUtils'], (baja, ansyncUtils) => {
  const subscriber = new baja.Subscriber();
  baja.Ord.make('station:|slot:/MSSQL/Temp').get({ subscriber })
    .then((point) => {
      subscriber.attach('changed', (prop, cx) => {
        console.log(point);
      });
      
      return asyncUtils.waitInterval(6000)
        .then(() => subscriber.unsubscribeAll());
    })
})