console.log('Test Power-Up JS loaded');

TrelloPowerUp.initialize({
  'board-buttons': function(t, options) {
    return [{
      text: 'Test Button',
      callback: function(t) {
        return t.popup({
          title: 'Test Popup',
          url: './test.html',
          height: 200
        });
      }
    }];
  }
});