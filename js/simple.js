console.log('Simple Power-Up loading...');

window.TrelloPowerUp.initialize({
  'board-buttons': function(t, options) {
    console.log('Board buttons called');
    return [{
      text: 'Simple Test',
      callback: function(t) {
        console.log('Button clicked');
        return t.popup({
          title: 'Test Working!',
          url: './simple.html',
          height: 200
        });
      }
    }];
  }
});

console.log('Simple Power-Up initialized');