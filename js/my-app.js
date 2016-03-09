// Initialize your app
var myApp = new Framework7({
  pushState: true,
  material: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main');