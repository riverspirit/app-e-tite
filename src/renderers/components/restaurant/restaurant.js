Vue.component('restaurant', {
  template: '#restaurant',
  props: ['details'],
  data() {
    return {};
  },
  methods: {
    fetchReviews(placeId) {
      this.$root.$emit('fetch-reviews', placeId);
    },
  },
});
