'use strict';
/*global console*/

/**
 * Repository pattern to CRUD sites.
 * @class SitesRepository
 * @constructor
 * @module core
 */
var SitesRepository = function(dbUrl, collectionName) {

    var mongoose = require('mongoose');

    var Site
    var Tag

    /**
     * Connect to the db.
     * @param callback {object} - the called function once connected
     */
    var _connect = function () {
        console.log('Opening db connection : %s', dbUrl);
        mongoose.connect(dbUrl, function (err) {
            if (err) {
                console.error("erreur lors de la connection à " + dbUrl);
            } else {
                Site = mongoose.model(collectionName, {
                    lien: String,
                    titre: String,
                    note: Number,
                    tags: [{ name: String}],
                    enCours: Boolean,
                    occurances: Number
                });
                Tag = mongoose.model('tag' + collectionName, {
                    name: String
                });
                console.log("connection à %s initialisée", dbUrl);
            }
        });


    };

    /**
     * Close the connection
     */
    var _close = function () {
        console.log('Closing db connection...');
        mongoose.disconnect(function(err, result) {
            if (err) {
                throw err;
            }
            console.log('Done');
        });
    };

    /**
     * Insert a site
     * @method insert
     * @param {Object} site - the site to insert, not checked against a particular schema
     * @param {Function} callback - function to be called with error and success objects in param after the insert
     */
    var _insert = function (site, callback) {
        console.log("création du site");

        var newDBSite = new Site(site);

        newDBSite.save(function (err) {
            if (err) {
                console.log('erreur ...');
            }
            callback(newDBSite);
        });

        _insertTags(site, function (tag) {
            console.log("insertion du tag : " + tag.name);
        });
    };

    /**
     * Insert tags from a site
     * @method insert
     * @param {Object} site - the site to insert, not checked against a particular schema
     * @param {Function} callback - function to be called with error and success objects in param after the insert
     */
    var _insertTags = function(site, callback) {
        console.log("création des tags site");

        if (null != site.tags) {
            for (var i=0 ; i<site.tags.length ; i++) {
                var newDBTag = new Tag(site.tags[i]);
                console.log(newDBTag);
                _findTag(site.tags[i], null, null, function(tags){
                    if (null == tags || 0 == tags.length) {
                        newDBTag.save(function (err) {
                            if (err) console.log("erreur ...");
                            callback(newDBTag);
                        });
                    }
                });
            }
        }

    };


    /**
     * Find a site
     * @method find
     * @param {Object} query - query to search against
     * @param {Function} callback - function to be called with error and data objects in param after the find
     */
    var _find = function(query, limit, skip, callback) {
        Site.find(query, function (err, sites) {
            if (err) // TODO handle err
                console.log(sites);
            callback(sites);
        })
    };

    /**
     * Find a tag
     * @method find
     * @param {Object} query - query to search against
     * @param {Function} callback - function to be called with error and data objects in param after the find
     */
    var _findTag = function(query, limit, skip, callback) {
        Tag.find(query, function (err, tags) {
            if (err) // TODO handle err
                console.log(tags);
            callback(tags);
        })
    };

    /**
     * Update a site
     * @method update
     * @param {String} lien - query to search against
     * @param {Object} update - update to apply (ex: {$inc: { occurances: 1 }})
     * @param {Function} callback - function to be called with error and data objects in param after the update
     */
    var _update = function(lien, update, callback) {
        Site.update({lien: lien}, update, { multi: true }, function (err, numberAffected, raw) {
            var numberUpdated = -1
            if (err) {
                console.log(err);
            } else {
                console.log('The number of updated documents was %d', numberAffected);
                console.log('The raw response from Mongo was ', raw);
                numberUpdated = numberAffected;
            }
            callback(numberUpdated);
        });
    };

    /**
     * Delete a site
     * @method delete
     * @param {String} lien - query to search against
     * @param {Function} callback - function to be called with error and data objects in param after the delete
     */
    var _delete = function(site, callback) {
        console.log("sitesRepository.delete");
        Site.remove({lien: site.lien}, function (err, numberAffected, raw) {
            if (err) {
                console.log(err);
            } else {
                console.log('The number of updated documents was %d', numberAffected);
                console.log('The raw response from Mongo was ', raw);
            }
            callback();
        });
        console.log("sitesRepository.delete - end");
    };



    return {
        connect : _connect,
        close : _close,
        insert : _insert,
        find : _find,
        update: _update,
        delete: _delete
    };
};

module.exports = SitesRepository;
