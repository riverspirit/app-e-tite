const path = require('path');
const Loki = require('lokijs');
const {config} = require('../config');

const collections = {
  PLACES: 'places',
  RATINGS: 'ratings',
};

let db;

function databaseInitialize() {
  if (!db.getCollection(collections.PLACES)) {
    db.addCollection(collections.PLACES);
  }

  if (!db.getCollection(collections.RATINGS)) {
    db.addCollection(collections.RATINGS);
  }
}

const dbPath = path.join(config.appDataPath, config.appId, 'loki.db');
db = new Loki(dbPath, {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 5000, // persists data to the disk every 5 seconds
});

const ElectronStore = require('electron-store');

const configStore = new ElectronStore();

module.exports = {db, collections, configStore};
