/**
 * The <rating-display> component
 */

Vue.component('rating-display', {
  template: '#rating-display',
  props: {
    rating: {
      default: 0,
    },
    placeId: true,
  },
  data() {
    return {
      rating: 0,
    };
  },

  computed: {
    classObject() {
      const rating = this.rating || 0;
      const className = `rating-${rating}`;
      const classObj = {};
      classObj[className] = true;
      return classObj;
    },
  },

  methods: {
    placeSelected() {
      this.$root.$emit('place-selected', this.placeId);
    },
  },
});
