const config = {
  appId: 'app-e-tite',
  appDataPath: null,
};

function init(appDataPath) {
  config.appDataPath = appDataPath || config.appDataPath;
  return config;
}

config.init = init;

module.exports = {config, init};
