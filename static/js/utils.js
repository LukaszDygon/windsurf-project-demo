/**
 * Utility functions for the Windsurfing Weather Dashboard
 * 
 * This module provides common utility functions for temperature conversion,
 * date formatting, and other shared functionality across the application.
 * 
 * @module utils
 */

/**
 * Converts temperature from Kelvin to Celsius
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} Temperature in Celsius, rounded to nearest integer
 */
export function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

/**
 * Formats a Unix timestamp into human-readable date and time
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {Object} Object containing formatted time and date strings
 * @property {string} time - Formatted time (e.g., "2:00 PM")
 * @property {string} date - Formatted date (e.g., "Mon, Jan 8")
 */
export function formatDateTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return { time: timeStr, date: dateStr };
}

/**
 * Calculates temperature range from actual and feels-like temperatures
 * @param {number} temp - Actual temperature in Kelvin
 * @param {number} feels_like - Feels-like temperature in Kelvin
 * @returns {Object} Object containing low and high temperature strings
 * @property {string} low - Lower temperature with unit (e.g., "18°C")
 * @property {string} high - Higher temperature with unit (e.g., "22°C")
 */
export function getTemperatureRange(temp, feels_like) {
    const actualC = kelvinToCelsius(temp);
    const feelsLikeC = kelvinToCelsius(feels_like);

    const minC = Math.min(actualC, feelsLikeC);
    const maxC = Math.max(actualC, feelsLikeC);

    return {
        low: `${minC}°C`,
        high: `${maxC}°C`
    };
}
