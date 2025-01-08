# Rad Windsurfing Weather Dashboard 🏄‍♂️

A modern web application for checking windsurfing conditions with real-time weather data and interactive map selection.

## Features

- 🗺️ Interactive map for location selection
- 🌡️ Temperature ranges (actual and feels like)
- 💨 Wind conditions with surfer-friendly descriptions
- 🌊 Hourly forecasts for the next 24 hours
- ⚠️ Weather alerts and warnings
- 📱 Responsive design for all devices

## Project Structure

```
static/
  ├── js/
  │   ├── main.js       # Main application entry point
  │   ├── map.js        # Map initialization and handling
  │   ├── weather.js    # Weather data and conditions
  │   ├── ui.js         # UI rendering functions
  │   └── utils.js      # Utility functions
  └── styles.css        # Application styles

templates/
  └── index.html        # Main HTML template
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set your OpenWeatherMap API key:
   ```bash
   export WEATHER_API_KEY='your_api_key_here'
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open http://localhost:5000 in your browser

## Dependencies

- Flask: Web framework
- Requests: HTTP client for API calls
- Leaflet.js: Interactive maps
- OpenWeatherMap API: Weather data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

The project uses ES6 modules for better code organization. Each module has a specific responsibility:

- `main.js`: Application initialization and coordination
- `map.js`: Map functionality and location handling
- `weather.js`: Weather data fetching and processing
- `ui.js`: UI rendering and updates
- `utils.js`: Shared utility functions
