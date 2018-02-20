/**
 * The ratings module
 * Exports methods required to save and fetch ratings/reviews.
 */

const {db, collections, configStore} = require('../db');

/**
 * Sort function to sort records in the descending order of timestamp (latest first)
 * This function is not to be directly called, instead it can be passed to Array.prototype.sort
 *
 * @param {*} a - Item one
 * @param {*} b - Item two
 */
function sortByTimestamp(a, b) {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else if (a.timestamp > b.timestamp) {
    return -1;
  }
  return 0;
}

/**
 * Get rating for the given placeId
 *
 * @param {string} placeId - placeId from the Google service
 * @returns {Promise} - promise that resolves with rating and review count
 */
function getRating(placeId) {
  return new Promise((resolve) => {
    // Promise and setImmediate are used so that if there are a large amount of
    // data to crunch to find the rating, it shouldn't block the current execution thread.
    // Ideally the computed aggregate rating value should be cached in db so that this
    // number-crunching doesn't need to happen during every read operation.
    setImmediate(() => {
      const collection = db.getCollection(collections.RATINGS);
      const allRatings = collection.find({placeId});
      const sumOfRatings = allRatings.reduce((sum, thisItem) => sum + thisItem.ratingValue, 0);
      const ratingCount = allRatings.length;
      const average = sumOfRatings / ratingCount;
      const newRating = Number.isNaN(average) ? 0 : Math.round(average);
      resolve({newRating, ratingCount});
    });
  });
}

/**
 * Save a review and rating for the given placeId
 *
 * @param {string} placeId - placeId
 * @param {number} ratingValue - Rating value
 * @param {string|null} ratingText - Review text
 * @returns {Promise:getRating}
 */
function saveRating(placeId, ratingValue, ratingText) {
  const collection = db.getCollection(collections.RATINGS);
  const author = configStore.get('deviceId');
  const timestamp = new Date().getTime();
  collection.insert({placeId, ratingValue, ratingText, author, timestamp});
  return getRating(placeId);
}

/**
 * Get all reviews for the given placeId
 *
 * @param {string} placeId - placeId
 * @returns {Array}
 */
function getReviews(placeId) {
  const collection = db.getCollection(collections.RATINGS);
  const allReviews = collection.find({placeId});
  allReviews.sort(sortByTimestamp);
  return allReviews;
}

module.exports = {saveRating, getRating, getReviews};
