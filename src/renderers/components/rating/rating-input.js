Vue.component('rating-input', {
  template: '#rating-input',
  props: ['rating'],
  data() {
    return {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rating: 0,
    };
  },
  methods: {
    rate(value) {
      this.rating = value;
      this.$root.$emit('rating-added', value);
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
