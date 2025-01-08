/**
 * Weather-related functionality for the Windsurfing Weather Dashboard
 * 
 * This module handles weather data processing, wind conditions classification,
 * and weather API interactions. It provides functions for interpreting wind
 * speeds and formatting weather descriptions in surfer-friendly language.
 * 
 * @module weather
 */

/**
 * Determines CSS class based on wind speed for styling
 * @param {number} speed - Wind speed in meters per second
 * @returns {string} CSS class name for wind speed styling
 */
export function getWindSpeedClass(speed) {
    if (speed < 5) return '';  // Not surfable
    if (speed < 10) return 'good';  // Perfect for beginners
    if (speed < 15) return 'moderate';  // Gnarly waves
    return 'strong';  // Epic conditions
}

/**
 * Gets a detailed wind condition description for current weather
 * @param {number} speed - Wind speed in meters per second
 * @returns {string} Surfer-friendly description of wind conditions
 */
export function getWindDescription(speed) {
    if (speed < 5) return 'Too chill';
    if (speed < 10) return 'Perfect for newbies';
    if (speed < 15) return 'Gnarly!';
    return 'Epic waves!';
}

/**
 * Gets a short wind condition description for forecast
 * @param {number} speed - Wind speed in meters per second
 * @returns {string} Short description of wind conditions
 */
export function getShortWindDescription(speed) {
    if (speed < 5) return 'Flat';
    if (speed < 10) return 'Clean';
    if (speed < 15) return 'Gnarly';
    return 'Epic';
}

/**
 * Fetches weather data from the OpenWeatherMap API
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @returns {Promise<Object>} Weather data response
 * @throws {Error} If the API request fails or returns an error
 */
export async function fetchWeatherData(lat, lon) {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}
