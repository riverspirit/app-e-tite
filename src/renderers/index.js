const {ipcRenderer} = require('electron');
const findIndex = require('lodash.findindex');
const {geolocate, geocode, getLocality} = require('./geolocation');
const {search} = require('./search');
require('./components/restaurant/');
require('./components/rating');

/* eslint-disable no-unused-vars */
const app = new Vue({
/* eslint-enable no-unused-vars */
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
            const placeIdList = new Set();

            const formattedPlaceList = placesList.map((place) => {
              const placeClone = Object.assign({}, place);
              placeIdList.add(placeClone.place_id);
              placeClone.appetiteRating = placeClone.appetiteRating || 0;
              placeClone.ratingCount = placeClone.ratingCount || 0;
              return placeClone;
            });

            [...placeIdList].forEach((placeId) => {
              ipcRenderer.send('get-rating', placeId);
            });

            this.restaurants.push(...formattedPlaceList);
          }).catch(_ => _);
        }).catch(_ => _);
      }).catch(_ => _);
    },

    saveRating() {
      const selectedPlace = Object.assign({}, this.selectedPlace);
      selectedPlace.appetiteRating = this.ratingValue;
      const placeId = this.selectedPlace.place_id;
      const {ratingValue, ratingText} = this;

      ipcRenderer.send('save-rating', {placeId, ratingValue, ratingText});

      // Once the rating is saved, reset the variables
      this.selectedPlace = null;
      this.ratingValue = 0;
      this.ratingText = null;
    },
  },

  mounted() {
    // Fetch and show the list of restaurants when the app is loaded
    this.getRestaurants();
  },

  created() {
    this.$on('place-selected', (placeId) => {
      const index = findIndex(this.restaurants, {place_id: placeId});
      this.selectedPlace = this.restaurants[index];
    });

    this.$on('rating-added', (value) => {
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
