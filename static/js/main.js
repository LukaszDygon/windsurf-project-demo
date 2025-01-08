/**
 * Main application entry point for the Windsurfing Weather Dashboard
 * 
 * This module coordinates the application's core functionality by initializing
 * the map and handling weather updates. It serves as the central coordinator
 * between the map, weather data, and UI components.
 * 
 * @module main
 */

import { initMap } from './map.js';
import { fetchWeatherData } from './weather.js';
import { displayAlerts, renderCurrentWeather, renderHourlyForecast, showError, clearDisplays } from './ui.js';

/**
 * Updates the weather display for a given location
 * @param {number} lat - Latitude of the selected location
 * @param {number} lon - Longitude of the selected location
 * @private
 */
async function updateWeather(lat, lon) {
    clearDisplays();
    
    try {
        const data = await fetchWeatherData(lat, lon);
        
        displayAlerts(data.alerts);
        
        const currentWeather = document.getElementById('current-weather');
        currentWeather.innerHTML = renderCurrentWeather(data.current);
        
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = renderHourlyForecast(data.hourly);
    } catch (error) {
        showError('Bummer! Something went wrong. Try again, dude!');
        console.error('Error:', error);
    }
}

// Initialize the map and set up weather updates
initMap((lat, lon) => updateWeather(lat, lon));
