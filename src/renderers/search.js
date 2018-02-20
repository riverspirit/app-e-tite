/*
 * Search module
 */

/**
 * Returns the list of places formatted for display
 *
 * @param {Array} placeList - list of places
 */
function processPlaceInfo(placeList) {
  return placeList.map((place) => {
    const placeClone = Object.assign({}, place);
    placeClone.imageURL = '../public/images/no-image.png';

    if (placeClone.photos && placeClone.photos[0]) {
      placeClone.imageURL = placeClone.photos[0].getUrl({maxWidth: 200});
    }

    placeClone.styleObject = {
      backgroundImage: `url('${placeClone.imageURL}')`,
    };
    return placeClone;
  });
}

/**
 * Get the list of restaurants within 500 meters of the given location coordinates
 *
 * @param {Number} latitude - Latitude
 * @param {Number} longitude - Latitude
 *
 * @returns {Promise}
 */
function search(latitude, longitude) {
  return new Promise((resolve) => {
    const location = new google.maps.LatLng(latitude, longitude);
    const request = {
      location,
      radius: '500', // meters
      type: ['restaurant'],
    };

    // Map won't be loaded in the UI, but #map-container is required to create instance
    // of the PlacesService.
    const service = new google.maps.places.PlacesService(document.querySelector('#map-container'));
    service.nearbySearch(request, (results) => {
      if (results && Array.isArray(results)) {
        const placesList = processPlaceInfo(results);
        resolve(placesList);
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = {search};
