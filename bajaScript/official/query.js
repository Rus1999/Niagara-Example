require(["baja!", "dialogs"], (baja, dialogs) => {
  "use strict";

  const messages = [];

  function log(str) {
    messages.push(str);
  };

  // function called after having a cursor 
  const resultFn = result => {
    result.getColumns().forEach((c) => {
      log("Column: " + c.getDisplayName());
    });
    // dialogs.showOk({ content: `<pre> ${messages.join} </pre>` });
    dialogs.showOk({ content: "<pre>" + messages.join('\n') + "</pre>" });
  }

  // run the bql query in the station and print out the result
  baja.Ord.make("station:|slot:/|bql:select toPathString from baja:Component")
    .get({
      cursor: {
        before: function () {
          log("Called just before iterating through the Cursor");
        },
        after: function () {
          log("Called just after iterating through the Cursor");
        },
        each: function () {
          log("Each: " + this.get("toPathString"));
        },
        limit: 15, // Specify optional limit on the number of records (defaults to 10)
        offset: 0, // Specify optional record offset (defaults to 0)
      },
    })
    .then(resultFn)
    .catch((err) => baja.error(err));
});
