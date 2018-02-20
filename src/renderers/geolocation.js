// var output = document.getElementById("out");

// function success(position) {
//   var latitude  = position.coords.latitude;
//   var longitude = position.coords.longitude;

//   output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

//   var img = new Image();
//   img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

//   output.appendChild(img);
// }

// function error() {
//   output.innerHTML = "Unable to retrieve your location";
// }

// output.innerHTML = "<p>Locating…</p>";

// if (results[0]) {
//   map.setZoom(11);
//   var marker = new google.maps.Marker({
//     position: latLng,
//     map: map
//   });
//   infowindow.setContent(results[0].formatted_address);
// } else {
//   window.alert('No results found');
// }

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

function geolocate() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(position.coords);
    }, reject);
  });
}

module.exports = {geolocate, geocode, getLocality};
