const config = {
  appId: 'app-e-tite',
  appDataPath: null,
  googleAPIKey: 'AIzaSyAtSOKvgxPuIU4jmtGTxT-Rn-mMmHNnWFU',
};

process.env.GOOGLE_API_KEY = config.googleAPIKey;

function init(appDataPath) {
  config.appDataPath = appDataPath || config.appDataPath;
  return config;
}

config.init = init;

module.exports = {config, init};
