# Trello Lead & Cycle Time Addon

This project provides two ways to track card movements in Trello and calculate lead time and cycle time metrics:

1. **Trello Power-Up** (Recommended) - Integrates directly into Trello's interface
2. **Standalone Server** - Webhook-based server application

## Approach 1: Trello Power-Up (Recommended)

The Power-Up runs directly inside Trello boards as a native addon, adding buttons and metrics to the Trello interface.

### Power-Up Features

- **Integrated UI** - Buttons and badges directly in Trello boards
- **Board-level metrics** - Average lead/cycle times and throughput
- **Card-level metrics** - Individual card timing and movement history
- **Configurable workflow** - Define which lists represent different stages
- **Real-time calculation** - Uses Trello's action history API
- **No server required** - Runs entirely in the browser

### How to Use the Power-Up

1. **Host the files**: Upload `manifest.json`, `power-up.html`, `power-up.js`, and `card-metrics.html` to a web server (GitHub Pages, Netlify, etc.)

2. **Create Power-Up**: 
   - Go to [Trello Power-Ups](https://trello.com/power-ups/admin)
   - Click "Create new Power-Up"
   - Enter your hosted manifest.json URL
   - Enable the Power-Up on your board

3. **Configure workflow**:
   - Click "Lead & Cycle Times" button in board header
   - Configure which lists represent Start, In Progress, and Done
   - Save settings

4. **View metrics**:
   - Board metrics appear in the popup
   - Individual card metrics show as badges
   - Click card "View Metrics" button for detailed history

## Approach 2: Standalone Server

A Node.js application that uses webhooks to track card movements and provides a web dashboard.

## Definitions

- **Lead Time**: Total time from when a card is created or enters the workflow until it's completed
- **Cycle Time**: Time from when work actually begins (card enters "In Progress") until completion

Example: 
- Card created in "To Do" on Jan 1st
- Moved to "In Progress" on Jan 3rd  
- Moved to "Done" on Jan 10th
- Lead Time: 9 days (Jan 1st to Jan 10th)
- Cycle Time: 7 days (Jan 3rd to Jan 10th)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
TRELLO_API_KEY=your_trello_api_key_here
TRELLO_API_TOKEN=your_trello_api_token_here
TRELLO_WEBHOOK_SECRET=your_webhook_secret_here
PORT=3000
NODE_ENV=development
DB_PATH=./data/metrics.db
```

### 3. Get Trello API Credentials

1. Go to [Trello Developer Portal](https://trello.com/app-key)
2. Get your API Key
3. Generate a Token (click the link to authorize your application)
4. Create a webhook secret (any random string for security)

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Setting Up Trello Webhooks

To track card movements in real-time, you need to register a webhook with Trello:

### Using Trello API

Make a POST request to create a webhook:

```bash
curl -X POST \
  "https://api.trello.com/1/webhooks/?key=YOUR_API_KEY&token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Card movement tracking",
    "callbackURL": "https://your-server.com/webhook",
    "idModel": "BOARD_ID_TO_MONITOR"
  }'
```

Replace:
- `YOUR_API_KEY` with your Trello API key
- `YOUR_TOKEN` with your Trello token
- `https://your-server.com/webhook` with your server's webhook URL
- `BOARD_ID_TO_MONITOR` with the ID of the board you want to track

### Getting Board ID

The Board ID can be found in the Trello board URL:
```
https://trello.com/b/BOARD_ID/board-name
```

## Usage

### Web Dashboard

1. Open `http://localhost:3000` in your browser
2. Enter a Trello Board ID
3. Click "Load Metrics" to see current statistics

### API Endpoints

- `GET /api/metrics/:boardId` - Get board-level metrics
- `GET /api/card-metrics/:cardId` - Get metrics for a specific card
- `GET /api/list-metrics/:listId` - Get metrics for cards in a specific list
- `POST /webhook` - Webhook endpoint for Trello (configured automatically)

### Board Configuration

You can configure which lists represent different workflow stages by making API calls or by extending the application with a configuration interface.

Example board configuration:
```javascript
{
  "startLists": ["list_id_1", "list_id_2"], // Lists that represent workflow start
  "inProgressLists": ["list_id_3"],         // Lists that represent active work
  "endLists": ["list_id_4", "list_id_5"]   // Lists that represent completion
}
```

## Database Schema

The application uses SQLite with the following tables:

- **card_movements**: Records every card movement between lists
- **board_configs**: Stores workflow configuration for each board
- **card_metrics**: Calculated lead and cycle times for each card

## Development

### Running Tests

```bash
npm test
```

### Project Structure

```
├── src/
│   ├── database.js          # Database setup and schema
│   ├── webhookHandler.js    # Processes Trello webhook events
│   └── metricsCalculator.js # Calculates lead and cycle times
├── public/
│   └── index.html          # Web dashboard
├── server.js               # Express server and API routes
└── package.json
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Configure your webhook URL to point to your deployed server
3. Ensure your server is accessible from the internet for webhooks
4. Consider using a process manager like PM2

## Troubleshooting

### Webhook Not Receiving Events

1. Verify your server is accessible from the internet
2. Check that the webhook URL is correct in Trello
3. Ensure your webhook secret matches between Trello and your `.env` file
4. Check server logs for webhook processing errors

### Missing Metrics

1. Ensure webhooks are properly configured
2. Check that cards are actually moving between lists
3. Verify board configuration matches your workflow
4. Look at the `card_movements` table to see if movements are being recorded

## License

MIT