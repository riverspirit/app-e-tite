/**
 * Get the name of the sublocality from the address lookup response
 *
 * @param {Array} results - Address lookup response
 */
function getLocality(results) {
  let locality = null;

  if (!results || !results[0]) {
    return null;
  }

  if (results[0].address_components && Array.isArray(results[0].address_components)) {
    locality = results[0].address_components.reduce((accumulator, currentItem) => {
      if (currentItem && currentItem.types && currentItem.types.includes('sublocality')) {
        return currentItem.long_name;
      }
      return accumulator;
    }, null);
  }

  return locality;
}

/**
 * Lookup the address of given set of latitude and longitude
 *
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise}
 */
function geocode(latitude, longitude) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const latLng = {lat: latitude, lng: longitude};

    geocoder.geocode({location: latLng}, (results, status) => {
      if (status === 'OK') {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
}

/**
 * Get the location of the user from browse geolocation
 *
 * @returns {Promise}
 */
function geolocate() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(position.coords);
    }, reject);
  });
}

module.exports = {geolocate, geocode, getLocality};
