var t = window.TrelloPowerUp.iframe();

t.render(function() {
    return t.sizeTo('#content');
});

var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', async function() {
    try {
        // Get API key from settings
        const apiKey = await t.get('board', 'shared', 'apiKey');
        if (!apiKey) {
            alert('Please configure your API key in the Power-Up settings first.');
            return;
        }

        // Create authorization URL
        const authUrl = `https://trello.com/1/authorize?expiration=never&scope=read&response_type=token&name=${encodeURIComponent('Lead & Cycle Time Metrics')}&key=${apiKey}&callback_method=postMessage`;
        
        console.log('Starting authorization with URL:', authUrl);
        
        // Authorize and get token
        const token = await t.authorize(authUrl);
        console.log('Authorization successful, token received');
        
        // Store token following tutorial pattern
        await t.set('member', 'private', 'authToken', token);
        console.log('Token stored successfully');
        
        // Close popup
        return t.closePopup();
        
    } catch (error) {
        console.error('Authorization failed:', error);
        alert('Authorization failed: ' + error.message);
    }
});