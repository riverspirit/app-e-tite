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

function search(latitude, longitude) {
  return new Promise((resolve) => {
    const location = new google.maps.LatLng(latitude, longitude);
    const request = {
      location,
      radius: '500',
      type: ['restaurant'],
    };

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
