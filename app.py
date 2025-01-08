"""Rad Windsurfing Weather Dashboard Backend.

This Flask application serves as the backend for the Windsurfing Weather Dashboard,
providing weather data from OpenWeatherMap API and serving static files. It acts as
a proxy to hide the API key and provides endpoints for the frontend to consume.

Routes:
    /: Serves the main dashboard page
    /api/weather: Provides weather data for a given location
    /static/js/<path>: Serves JavaScript modules

Environment Variables:
    WEATHER_API_KEY: OpenWeatherMap API key (required)
"""

from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

WEATHER_API_KEY = os.getenv('WEATHER_API_KEY', 'your_api_key_here')
WEATHER_API_URL = 'https://api.openweathermap.org/data/3.0/onecall'

@app.route('/')
def home():
    """Serves the main dashboard page.
    
    Returns:
        str: Rendered HTML template for the dashboard.
    """
    return render_template('index.html')

@app.route('/api/weather')
def get_weather():
    """Fetches weather data from OpenWeatherMap API for a given location.
    
    Args:
        lat (str): Latitude of the location, passed as query parameter.
        lon (str): Longitude of the location, passed as query parameter.
    
    Returns:
        tuple: A pair (json_response, status_code) where json_response is a dict
            containing weather data or error message and status_code is an int
            HTTP status code.

            Success Response Format:
                {
                    "current": {
                        "temp": float,          # Temperature in Kelvin
                        "feels_like": float,    # Feels like temperature in Kelvin
                        "humidity": int,        # Humidity percentage
                        "wind_speed": float,    # Wind speed in m/s
                        "weather": [{           # Weather condition details
                            "main": str,        # Main weather condition
                            "description": str, # Detailed description
                            "icon": str        # Weather icon code
                        }]
                    },
                    "hourly": [                # Hourly forecast (24 hours)
                        {
                            # Same structure as "current"
                        }
                    ],
                    "alerts": [{               # Weather alerts if any
                        "event": str,         # Alert event type
                        "description": str,   # Alert description
                        "severity": str      # Alert severity level
                    }]
                }

            Error Response Format:
                {
                    "error": str  # Error message
                }
    
    Raises:
        requests.RequestException: If the OpenWeatherMap API request fails.
        Exception: For any other server-side errors.

    Returns:
        tuple: (response_json, status_code)
            response_json: Dict containing weather data or error message
            status_code: HTTP status code (200, 400, or 500)
    """
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        params = {
            'lat': lat,
            'lon': lon,
            'exclude': 'minutely',  # Include alerts
            'appid': WEATHER_API_KEY
        }
        
        response = requests.get(WEATHER_API_URL, params=params)
        response.raise_for_status()
        
        return jsonify(response.json())
        
    except requests.RequestException as e:
        return jsonify({'error': f'Weather API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/static/js/<path:filename>')
def serve_js(filename):
    """Serves JavaScript module files from the static/js directory.
    
    Args:
        filename (str): Path to the JavaScript file relative to static/js.
    
    Returns:
        flask.Response: JavaScript file with appropriate MIME type.
    
    Note:
        This route is necessary for proper ES6 module loading in modern browsers.
        The response includes the correct Content-Type header for JavaScript modules.
    """
    return app.send_static_file(f'js/{filename}')

if __name__ == '__main__':
    app.run(debug=True)
