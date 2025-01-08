/**
 * UI components and rendering for the Windsurfing Weather Dashboard
 * 
 * This module handles all UI-related functionality including rendering weather
 * information, alerts, and managing the display state. It provides functions
 * for creating and updating various sections of the dashboard.
 * 
 * @module ui
 */

import { formatDateTime, getTemperatureRange } from './utils.js';
import { getWindSpeedClass, getWindDescription, getShortWindDescription } from './weather.js';

/**
 * Displays weather alerts in the alerts container
 * @param {Array<Object>} alerts - Array of weather alerts
 * @param {string} alerts[].event - Type of weather event
 * @param {string} alerts[].description - Detailed alert description
 * @param {string} alerts[].severity - Alert severity level
 */
export function displayAlerts(alerts) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';
    
    if (!alerts?.length) return;

    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alert.severity === 'Severe' ? 'severe' : ''}`;
        alertDiv.innerHTML = `
            <div>
                <strong>Heads up, bro! ${alert.event}:</strong> ${alert.description}
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        alertsContainer.appendChild(alertDiv);
    });
}

/**
 * Renders the current weather section
 * @param {Object} current - Current weather data
 * @param {Object} current.weather - Weather condition details
 * @param {number} current.temp - Current temperature in Kelvin
 * @param {number} current.feels_like - Feels-like temperature in Kelvin
 * @returns {string} HTML string for current weather section
 */
export function renderCurrentWeather(current) {
    const weather = current.weather[0];
    const tempRange = getTemperatureRange(current.temp, current.feels_like);
    const windDescription = getWindDescription(current.wind_speed);

    return `
        <div class="current-weather">
            <img class="weather-icon" 
                 src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" 
                 alt="${weather.description}">
            <h2>${weather.main}</h2>
            <p class="temperature">
                <span class="temp-label">Chilly:</span> ${tempRange.low}
                <span class="temp-label">Toasty:</span> ${tempRange.high}
            </p>
            <p>${weather.description}</p>
            ${renderWeatherDetails(current, windDescription)}
        </div>
    `;
}

/**
 * Renders weather details section
 * @param {Object} current - Current weather data
 * @param {string} windDescription - Formatted wind description
 * @returns {string} HTML string for weather details
 * @private
 */
function renderWeatherDetails(current, windDescription) {
    return `
        <div class="weather-details">
            <div class="weather-detail-item">
                <h3>Wave Power 🌊</h3>
                <p class="wind-speed ${getWindSpeedClass(current.wind_speed)}">
                    ${current.wind_speed} m/s<br>${windDescription}
                </p>
            </div>
            <div class="weather-detail-item">
                <h3>Moisture Vibes</h3>
                <p>${current.humidity}%</p>
            </div>
            <div class="weather-detail-item">
                <h3>Air Pressure</h3>
                <p>${current.pressure} hPa</p>
            </div>
            <div class="weather-detail-item">
                <h3>Sun Intensity</h3>
                <p>UV: ${current.uvi}</p>
            </div>
        </div>
    `;
}

/**
 * Renders the hourly forecast section
 * @param {Array<Object>} hourlyData - Array of hourly forecast data
 * @returns {string} HTML string for hourly forecast
 */
export function renderHourlyForecast(hourlyData) {
    return hourlyData.slice(0, 24).map(hour => {
        const dateTime = formatDateTime(hour.dt);
        const hourlyTempRange = getTemperatureRange(hour.temp, hour.feels_like);
        const windDesc = getShortWindDescription(hour.wind_speed);
        
        return `
            <div class="forecast-item">
                <div class="forecast-date">${dateTime.date}</div>
                <div class="forecast-time">${dateTime.time}</div>
                <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" 
                     alt="${hour.weather[0].description}">
                <div class="forecast-temp">
                    <div>Chilly: ${hourlyTempRange.low}</div>
                    <div>Toasty: ${hourlyTempRange.high}</div>
                </div>
                <div class="wind-speed ${getWindSpeedClass(hour.wind_speed)}">
                    ${hour.wind_speed} m/s<br>${windDesc}
                </div>
                <div class="forecast-description">${hour.weather[0].main}</div>
            </div>
        `;
    }).join('');
}

/**
 * Displays an error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Clears all weather displays
 */
export function clearDisplays() {
    document.getElementById('current-weather').innerHTML = '';
    document.querySelector('.forecast-container').innerHTML = '';
    document.getElementById('error-message').style.display = 'none';
}
