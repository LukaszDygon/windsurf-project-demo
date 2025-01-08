# Windsurf Project

A web application that helps windsurfers find the perfect conditions for their next session.

## Features

- 🌊 Real-time wind conditions and forecasts
- 📍 Location-based weather information
- 📊 Wind speed and direction visualization
- 🌡️ Temperature and humidity data
- 🌊 Hourly forecasts for the next 24 hours
- ⚠️ Weather alerts and warnings
- 📱 Responsive design for all devices
- 🎮 Interactive background animation with boids

## API Dependencies

The application uses the [OpenWeather API](https://openweathermap.org/api) for weather data:
- Current weather conditions
- Weather forecasts
- Wind speed and direction
- Temperature and humidity

Sign up for a free account at OpenWeather to get your API key.

## Project Structure

```
static/
  js/
  │   ├── map.js        # Map initialization and handling
  │   ├── weather.js    # Weather data and conditions
  │   ├── ui.js         # UI rendering functions
  │   ├── utils.js      # Utility functions
  │   ├── boids.js      # Interactive particle animation system
  │   └── surfer_phrases.js # Phrases for boid speech bubbles
  └── styles.css        # Application styles

templates/
  └── index.html       # Main application template
```

## Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory:
   ```
   OPENWEATHER_API_KEY=your_key_here
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open http://localhost:5000 in your browser

## Dependencies

- Python 3.8+
- Flask: Web framework
- Requests: HTTP client for API calls
- Leaflet.js: Interactive maps
- OpenWeatherMap API: Weather data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Code Overview

- `app.py`: Main Flask application
- `map.js`: Map rendering and location handling
- `weather.js`: Weather data fetching and processing
- `ui.js`: UI rendering and updates
- `utils.js`: Shared utility functions
- `boids.js`: Interactive particle animation system
- `surfer_phrases.js`: Phrases for boid speech bubbles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[MIT License](LICENSE)
