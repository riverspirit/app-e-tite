/**
 * Config module
 */

const config = {
  appId: 'app-e-tite',
  appDataPath: null,
  googleAPIKey: 'AIzaSyAtSOKvgxPuIU4jmtGTxT-Rn-mMmHNnWFU',
  windowHeight: 625,
  windowWidth: 1090,
};

// Setting Google API key in process.env is required for the geolocation and
// geocoding APIs to work.
process.env.GOOGLE_API_KEY = config.googleAPIKey;

/**
 * Init config module with app data location.
 * init() needs to be called only once, as early as possible when the app is loaded.
 *
 * @param {string} appDataPath - Location of app data directory
 */
function init(appDataPath) {
  config.appDataPath = appDataPath || config.appDataPath;
  return config;
}

config.init = init;

module.exports = {config, init};
