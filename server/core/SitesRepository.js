'use strict';

/**
 * Repository pattern to CRUD sites.
 * @class SitesRepository
 * @constructor
 * @module core
 */


var SitesRepository = function(dbUrl, collectionName) {

    var mongoose = require('mongoose');

    var Site

    /**
     * Connect to the db.
     * @param callback {object} - the called function once connected
     */
    var _connect = function() {
        console.log('Opening db connection : %s', dbUrl);
        mongoose.connect(dbUrl);

        Site = mongoose.model(collectionName, {
            lien: String,
            titre: String,
            commentaire: String,
            enCours: Boolean,
            occurances: Number
        });

    };

    /**
     * Close the connection
     */
    var _close = function() {
        console.log('Closing db connection...');
        mongoose.disconnect(function(err, result) {
            if (err) throw err;
            console.log('Done');
        });
    };

    /**
     * Insert a geek
     * @method insert
     * @param {Object} site - the geek to insert, not checked against a particular schema
     * @param {Function} callback - function to be called with error and success objects in param after the insert
     */
    var _insert = function(site, callback) {

        _find({lien : site.lien}, null, null, function(sites) {
            if (null != sites && sites.length > 0) {
                Site.update({lien: site.lien}, {$inc: { occurances: 1 }}, { multi: true }, function (err, numberAffected, raw) {
                    if (err) return console.log(err);
                    console.log('The number of updated documents was %d', numberAffected);
                    console.log('The raw response from Mongo was ', raw);
                });

                callback(sites[0]);
            } else {
                site.titre = "Non trouvé ...";
                site.enCours = true;
                site.occurances = 1;

                var newDBSite = new Site(site);

                newDBSite.save(function (err) {
                    if (err) // ...
                        console.log('erreur ...');

                    callback(newDBSite);
                });
            }
        })

    };

    /**
     * Find a geek
     * @method find
     * @param {Object} query - query to search against
     * @param {Function} callback - function to be called with error and data objects in param after the find
     */
    var _find = function(query, limit, skip, callback) {
        Site.find(query, function (err, sites) {
            if (err) // TODO handle err
                console.log(sites)
            callback(sites);
        })
    };

    return {
        connect : _connect,
        close : _close,
        insert : _insert,
        find : _find
    };
};

module.exports = SitesRepository;