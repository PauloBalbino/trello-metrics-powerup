# Trello Lead & Cycle Time Power-Up

A Trello Power-Up that calculates lead time and cycle time metrics for cards based on their movement between lists.

## Features

- **Board-level metrics**: Average lead/cycle times and throughput
- **Card-level metrics**: Individual timing and movement history  
- **Configurable workflow**: Define start, progress, and done lists
- **Real-time calculation**: Uses Trello's action history API
- **No server required**: Runs entirely in browser

## Setup

1. Enable this Power-Up on your Trello board
2. Click "Lead & Cycle Times" in board header
3. Configure your workflow lists (Start → Progress → Done)
4. Move cards between lists to see metrics!

## Definitions

- **Lead Time**: Time from workflow start to completion
- **Cycle Time**: Time from work start to completion

## Files

- `manifest.json`: Power-Up configuration
- `power-up.js`: Main Power-Up logic
- `power-up.html`: Board metrics interface
- `card-metrics.html`: Individual card metrics interface

## License

MIT