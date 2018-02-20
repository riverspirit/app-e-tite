/**
 * The <rating-input> component
 */

Vue.component('rating-input', {
  template: '#rating-input',
  props: ['rating'],
  data() {
    return {
      // Rating values shown on the rating input scale
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

      // Default rating value
      rating: 0,
    };
  },
  methods: {
    /**
     * Save a given rating
     * @param {*} value - rating value
     */
    rate(value) {
      this.rating = value;
      this.$root.$emit('rating-added', value);
    },

    /**
     * Get the classes that need to be applied to show all the numbers until
     * the selected rating value to be shown in color. For example, if the user
     * selected rating 4, then 1, 2 and 3 should also be shown in color along with 4.
     *
     * @param {Object} value - rating value selected by the user
     */
    getClasses(value) {
      const ratingClassName = `rating-${value}`;
      const classes = {};
      classes[ratingClassName] = true;
      classes['rating-unrated'] = value > this.rating;
      return classes;
    },
  },
});
