function makeImageURL(place) {
  place.imageURL = '../public/images/no-image.png';

  if (place.photos && place.photos[0]) {
    place.imageURL = place.photos[0].getUrl({maxWidth: 200});
  }

  place.styleObject = {
    backgroundImage: `url('${place.imageURL}')`,
  };
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
        results.forEach(makeImageURL);
        resolve(results);
      } else {
        resolve([]);
      }
    });
  });


  // function initialize() {

  // }

  // function callback(results, status) {
  //   if (status == google.maps.places.PlacesServiceStatus.OK) {
  //     for (const i = 0; i < results.length; i++) {
  //       const place = results[i];
  //       createMarker(results[i]);
  //     }
  //   }
  // }
}

module.exports = {search};
