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
    locationName: null,
    coordinates: {
      lat: null,
      lng: null,
    },
    restaurants: [],
    selectedPlace: null,
    ratingValue: 0,
    ratingText: null,
    reviewList: [],
  },
  methods: {
    /**
     * Find the user's location and fetch the list of nearby restaurants and
     * display in the UI. If any of these places were previously rated in the app
     * show those ratings as well.
     */
    getRestaurants() {
      geolocate().then((location) => {
        geocode(location.latitude, location.longitude).then((results) => {
          this.coordinates.lat = location.latitude;
          this.coordinates.lng = location.longitude;
          this.locationName = getLocality(results);

          // Once location is received from Geolocation API, get nearby restaurants
          // based on the coordinates.
          search(location.latitude, location.longitude).then((placesList) => {
            const placeIdList = new Set();

            this.restaurants = placesList.map((place) => {
              const placeClone = Object.assign({}, place);
              placeIdList.add(placeClone.place_id);
              placeClone.appetiteRating = placeClone.appetiteRating || 0;
              placeClone.ratingCount = placeClone.ratingCount || 0;
              return placeClone;
            });

            // Send messages to the main process, one each for each of the places
            // with a request to send back its ratings. The main process will calculate
            // the aggregate rating for the given place based on any previously ratings
            // stored in the database.
            [...placeIdList].forEach((placeId) => {
              ipcRenderer.send('get-rating', placeId);
            });
            // The errors caught below need to be handled appropriately
          }).catch(_ => _);
        }).catch(_ => _);
      }).catch(_ => _);
    },

    /**
     * Save a place's rating to the db
     */
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

  /**
   * Any code that needs to be run after the Vue instance has been
   * compiled and mounted goes here. Any code that needs the UI to be loaded
   * can go here.
   */
  mounted() {
    // Fetch and show the list of restaurants when the app is loaded
    this.getRestaurants();
  },

  /**
   * Code that needs to be run after the Vue instance has been created can be
   * added here. This is an ideal place to register event listeners.
   */
  created() {
    // A place has been selected (by opening its rating modal)
    this.$on('place-selected', (placeId) => {
      const index = findIndex(this.restaurants, {place_id: placeId});
      this.selectedPlace = this.restaurants[index];
    });

    // User clicked the publish rating button
    this.$on('rating-added', (value) => {
      this.ratingValue = value;
    });

    // Review list modal has been opened, fetch reviews
    this.$on('fetch-reviews', (placeId) => {
      // All db operations are done in the main process, so ask main for
      // the reviews.
      ipcRenderer.send('get-reviews', placeId);
    });

    // Watch for messages from the main process with any updates in a
    // place's ratings that we need to show in the UI
    ipcRenderer.on('rating-updated', (event, message) => {
      const {placeId, newRating, ratingCount} = message;
      const index = findIndex(this.restaurants, {place_id: placeId});
      this.$set(this.restaurants[index], 'appetiteRating', newRating);
      this.$set(this.restaurants[index], 'ratingCount', ratingCount);
    });

    // Watch for messages from the main process with list of reviews
    ipcRenderer.on('reviews-fetched', (event, reviews) => {
      this.reviewList = reviews;
    });
  },
});
