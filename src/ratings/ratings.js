const {db, collections, configStore} = require('../db');

function sortByTimestamp(a, b) {
  if (a.timestamp < b.timestamp) {
    return 1;
  } else if (a.timestamp > b.timestamp) {
    return -1;
  }
  return 0;
}

function getRating(placeId) {
  return new Promise((resolve) => {
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

function saveRating(placeId, ratingValue, ratingText) {
  const collection = db.getCollection(collections.RATINGS);
  const author = configStore.get('deviceId');
  const timestamp = new Date().getTime();
  collection.insert({placeId, ratingValue, ratingText, author, timestamp});
  return getRating(placeId);
}

function getReviews(placeId) {
  const collection = db.getCollection(collections.RATINGS);
  const allReviews = collection.find({placeId});
  allReviews.sort(sortByTimestamp);
  return allReviews;
}

module.exports = {saveRating, getRating, getReviews};
