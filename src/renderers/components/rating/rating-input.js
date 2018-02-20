Vue.component('rating-input', {
  template: '#rating-input',
  props: [],
  data() {
    return {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      classes: {
        'rating-1': true,
      },
      rating: 0,
    };
  },
  methods: {
    rate(value) {
      this.rating = value;
      this.$root.$emit('gaveRating', value);
    },
    getClasses(value) {
      const ratingClassName = `rating-${value}`;
      const classes = {};
      classes[ratingClassName] = true;
      classes['rating-unrated'] = value > this.rating;
      return classes;
    },
  },
});
