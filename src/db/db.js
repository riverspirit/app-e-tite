/**
 * Database module
 *
 * This module exports API to store in two separate data stores:
 *
 * The first one is Lokijs, an in-memory database with MongoDB like query syntax
 * and options to persist data to disk.
 *
 * Second one is electron-store, which is just a simple key-value store and is
 * used to persist app specific data such as the userId, auth token etc to the disk.
 */
const path = require('path');
const Loki = require('lokijs');
const ElectronStore = require('electron-store');
const {config} = require('../config');

const collections = {
  PLACES: 'places',
  RATINGS: 'ratings',
};

let db;
const dbPath = path.join(config.appDataPath, config.appId, 'loki.db');

/**
 * Initialize collections when the database is first loaded
 */
function databaseInitialize() {
  if (!db.getCollection(collections.PLACES)) {
    db.addCollection(collections.PLACES);
  }

  if (!db.getCollection(collections.RATINGS)) {
    db.addCollection(collections.RATINGS);
  }
}

db = new Loki(dbPath, {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 5000, // persists data to the disk every 5 seconds
});

const configStore = new ElectronStore();

module.exports = {db, collections, configStore};
