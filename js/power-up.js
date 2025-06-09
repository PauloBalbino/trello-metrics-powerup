// Trello Power-Up initialization
window.TrelloPowerUp.initialize({
  // Add button to board header
  'board-buttons': function(t, options) {
    return [{
      text: 'Lead & Cycle Times',
      callback: function(t) {
        return t.popup({
          title: 'Lead & Cycle Time Metrics',
          url: './power-up.html',
          height: 600
        });
      }
    }];
  },

  // Add badges to cards showing their metrics
  'card-detail-badges': function(t, options) {
    return t.get('board', 'shared', 'workflowConfig', {})
      .then(function(config) {
        if (!config.startLists || !config.doneLists) {
          return [];
        }

        return t.card('id', 'idList', 'name')
          .then(function(card) {
            return calculateCardMetricsQuick(t, card, config)
              .then(function(metrics) {
                const badges = [];
                
                if (metrics.leadTimeDays !== null) {
                  badges.push({
                    title: 'Lead Time',
                    text: `${metrics.leadTimeDays.toFixed(1)}d`,
                    color: metrics.isCompleted ? 'green' : 'yellow'
                  });
                }
                
                if (metrics.cycleTimeDays !== null) {
                  badges.push({
                    title: 'Cycle Time', 
                    text: `${metrics.cycleTimeDays.toFixed(1)}d`,
                    color: metrics.isCompleted ? 'green' : 'blue'
                  });
                }
                
                return badges;
              });
          });
      })
      .catch(function() {
        return [];
      });
  },

  // Add button to individual cards
  'card-buttons': function(t, options) {
    return [{
      text: 'View Metrics',
      callback: function(t) {
        return t.popup({
          title: 'Card Metrics',
          url: './card-metrics.html',
          height: 400
        });
      }
    }];
  },

  // Settings capability
  'show-settings': function(t, options) {
    return t.popup({
      title: 'Workflow Settings',
      url: './power-up.html',
      height: 600
    });
  },

  // Authorization status - check if user has authorized
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'authToken')
      .then(function(token) {
        return { authorized: !!token };
      })
      .catch(function() {
        return { authorized: false };
      });
  },

  'show-authorization': function(t, options){
  return t.popup({
    title: 'Authorize 🥑 Account',
    url: './auth.html',
    height: 140,
  });
},

  // Authorization URL - where to send user to authorize  
  'authorize-url': function(t, options) {
    return t.get('board', 'shared', 'apiKey').then(function(apiKey) {
      if (!apiKey) {
        throw new Error('API key not configured. Please configure your API key in the Power-Up settings.');
      }
      return 'https://trello.com/1/authorize?expiration=never&scope=read&response_type=token&name=' + 
             encodeURIComponent('Lead & Cycle Time Metrics') + 
             '&key=' + apiKey + 
             '&callback_method=postMessage';
    });
  }
});

// Quick metrics calculation for card badges
async function calculateCardMetricsQuick(t, card, config) {
  try {
    // Get limited actions for performance
    const actions = await t.get('card', 'shared', 'actions', []);

    if (!actions || actions.length === 0) {
      return { leadTimeDays: null, cycleTimeDays: null, isCompleted: false };
    }

    // Sort movements chronologically
    const movements = actions
      .filter(action => action.type === 'updateCard' && action.data.listAfter)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(action => ({
        date: action.date,
        toListId: action.data.listAfter?.id
      }));

    if (movements.length === 0) {
      return { leadTimeDays: null, cycleTimeDays: null, isCompleted: false };
    }

    // Find key dates
    let workflowStart = null;
    let workStart = null;
    let completion = null;
    let isCompleted = false;

    for (const movement of movements) {
      if (!workflowStart && config.startLists.includes(movement.toListId)) {
        workflowStart = new Date(movement.date);
      }
      if (!workStart && config.progressLists && config.progressLists.includes(movement.toListId)) {
        workStart = new Date(movement.date);
      }
      if (config.doneLists.includes(movement.toListId)) {
        completion = new Date(movement.date);
        isCompleted = true;
        break;
      }
    }

    // Check if currently in done list
    if (!isCompleted && config.doneLists.includes(card.idList)) {
      isCompleted = true;
      completion = new Date(); // Use current time as approximation
    }

    // Calculate times
    let leadTimeDays = null;
    let cycleTimeDays = null;

    if (workflowStart && completion) {
      leadTimeDays = (completion - workflowStart) / (1000 * 60 * 60 * 24);
    }

    if (workStart && completion) {
      cycleTimeDays = (completion - workStart) / (1000 * 60 * 60 * 24);
    }

    return {
      leadTimeDays,
      cycleTimeDays,
      isCompleted
    };
  } catch (error) {
    console.log('Error calculating card metrics:', error);
    return { leadTimeDays: null, cycleTimeDays: null, isCompleted: false };
  }
}
