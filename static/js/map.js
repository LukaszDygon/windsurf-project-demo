/**
 * Map functionality for the Windsurfing Weather Dashboard
 * 
 * This module handles the interactive map functionality, including initialization,
 * marker management, and location updates. It uses Leaflet.js for map rendering
 * and supports both click-based location selection and geolocation.
 * 
 * @module map
 */

let map;
let marker;

/**
 * Initializes the map and sets up event handlers
 * @param {Function} onLocationSelect - Callback function when location is selected
 * @param {number} onLocationSelect.lat - Selected latitude
 * @param {number} onLocationSelect.lon - Selected longitude
 */
export function initMap(onLocationSelect) {
    map = L.map('map').setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', (e) => {
        updateMarker(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
    });

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setView([latlng.lat, latlng.lng], 10);
                updateMarker(latlng);
                onLocationSelect(latlng.lat, latlng.lng);
            },
            error => {
                console.error("Error getting location:", error);
                updateLocationDisplay('Click on the map to select a location');
            }
        );
    } else {
        updateLocationDisplay('Click on the map to select a location');
    }
}

/**
 * Updates or creates a marker at the specified location
 * @param {Object} latlng - Latitude and longitude object
 * @param {number} latlng.lat - Latitude
 * @param {number} latlng.lng - Longitude
 * @private
 */
function updateMarker(latlng) {
    if (marker) {
        marker.setLatLng(latlng);
    } else {
        marker = L.marker(latlng).addTo(map);
    }
    updateLocationDisplay(`Latitude: ${latlng.lat.toFixed(6)}, Longitude: ${latlng.lng.toFixed(6)}`);
}

/**
 * Updates the location display text
 * @param {string} text - Text to display in the location display
 * @private
 */
function updateLocationDisplay(text) {
    document.getElementById('selected-coordinates').textContent = text;
}
