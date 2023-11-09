require(['baja!', 'dialogs', 'jquery'], (baja, dialogs, $) => {
  "use strict";

  // ----------------------------------------------
  // OK dialog box
  dialogs.showOk("Content")
    .ok(() => {
      console.log("The OK button has been clicked");
    });

  // OK dialog with title and html content
  dialogs.showOk({
    title: "OK title",
    content: "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>"
  })
    .ok(() => {
      console.log("The OK button has been clicked");
    })

  // ----------------------------------------------
  // Yes/No/Cancel dialog
  dialogs.showYesNoCancel({
    title:"Yes/No/Cancel title",
    content: "Content"
    })
    .yes(() => {
      console.log("The user click yes");
    })
    .no(() => {
      console.log("The user click no");
    })
    .cancel(() => {
      console.log("The user click cancel");
    })

  // ----------------------------------------------
  // show a loading dialog box and have it close after the AJAX call has finished
  dialogs.showLoading(0, $.ajax("https://192.168.1.159:447"));

  // ----------------------------------------------
  // Use promises to show a loading dialog box and then pop up another dialog
  var dlg = dialogs.showLoading();
  // After 2 seconds, close the loading box.
  setTimeout(() => {
    dlg.close();
  }, 2000);
  dlg.promise().then(([ dlg, buttonClicked ]) => {
    // prints 'ok'
    console.log(buttonClicked);
    dialogs.showOk("The foobar has finished loading!");
  });

  // ----------------------------------------------
  // show a dialog. have the content dynamically created by passing in a function for the conent
  dialogs.show((dlg, jq) => {
    jq.html("<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>");
  });

  // ----------------------------------------------
  // show a dialog. Have the conent dynamically created by passing in a function for the conent. 
  // The dialog will only show when the return promise has been resolved.
  dialogs.show((dlg, jq) => {
    return Promise.resolve($.ajax("/outsideConditions")
      .then((response) => {
        jq.html("The answer is..." + JSON.parse(response).answer);
      }));
  })

  // ----------------------------------------------
  // dialog box with background privacy setting.
  dialogs.showOk({
    title: "Title",
    content: "Content",
    private: true // ensures background contents are screened when the dialgo is showing
  })
  .ok(() => {
    console.log("The OK button has been clicked");
  });

  // ----------------------------------------------
  // custom button on dialog
  dialogs.show({
    content: "Show some stuff",
    buttons: [
      {
        name: "foo",
        handler: () => {
          alert("First annoying alert!");
        }
      }
    ]
  }).on("foo", () => {
    alert("This will also be called when foo button is clicked.");
  });
})