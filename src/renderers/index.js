const {ipcRenderer} = require('electron');
const findIndex = require('lodash.findindex');
const {geolocate, geocode, getLocality} = require('./geolocation');
const {search} = require('./search');
require('./components/restaurant/');
require('./components/rating');

const app = new Vue({
  el: document.querySelector('#app'),
  data: {
    message: 'Hello',
    locationName: null,
    coordinates: {
      lat: null,
      lng: null,
    },
    restaurants: [],
    selectedPlace: null,
    ratingValue: 0,
    ratingText: null,
  },
  methods: {
    getRestaurants() {
      geolocate().then((location) => {
        geocode(location.latitude, location.longitude).then((results) => {
          this.coordinates.lat = location.latitude;
          this.coordinates.lng = location.longitude;
          this.locationName = getLocality(results);
          search(location.latitude, location.longitude).then((placesList) => {
            placesList.forEach((place) => {
              if (place.appetiteRating === undefined) {
                place.appetiteRating = 0;
              }

              if (place.ratingCount === undefined) {
                place.ratingCount = 0;
              }

              ipcRenderer.send('get-rating', place.place_id);
            });

            this.restaurants.push(...placesList);
          }).catch(() => {
            // Handle the error
          });
        }).catch(_ => _);
      }).catch(_ => _);
    },

    saveRating() {
      const selectedPlace = Object.assign({}, this.selectedPlace);
      selectedPlace.appetiteRating = this.ratingValue;
      const placeId = this.selectedPlace.place_id;
      const {ratingValue, ratingText} = this;

      ipcRenderer.send('save-rating', {placeId, ratingValue, ratingText});
    },
  },

  created() {
    this.$on('placeSelected', (placeId) => {
      const index = findIndex(this.restaurants, {place_id: placeId});
      this.selectedPlace = this.restaurants[index];
    });

    this.$on('gaveRating', (value) => {
      this.ratingValue = value;
    });

    ipcRenderer.on('places-list', (event, updatedData) => {
      updatedData.forEach((placeInfo) => {
        const index = findIndex(this.restaurants, {place_id: placeInfo.place_id});
        if (index !== -1) {
          Vue.set(this.restaurants, index, placeInfo);
        }
      });
    });

    ipcRenderer.on('rating-updated', (event, message) => {
      const {placeId, newRating, ratingCount} = message;
      const index = findIndex(this.restaurants, {place_id: placeId});
      this.$set(this.restaurants[index], 'appetiteRating', newRating);
      this.$set(this.restaurants[index], 'ratingCount', ratingCount);
    });
  },
});
