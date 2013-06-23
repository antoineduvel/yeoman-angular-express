'use strict';

/**
 * Routes of the API
 * @class SiteRoutes
 * @constructor
 * @param {} TODO : Repo - the repo
 * @module routes
 */
var SiteRoutes = function () {
    var http = require('http'),
        sys = require('sys'),
        htmlparser = require('htmlparser2'),
        domUtils = htmlparser.DomUtils;

    var SitesRepository = require('../core/sitesRepository')

    var sitesRepository = new SitesRepository('mongodb://localhost:27017/test', 'sites');
    sitesRepository.connect();

    var handler = new htmlparser.DomHandler();

    var parser = new htmlparser.Parser(handler);

    var callbackSite = function (lien) {
        return function (res) {
            var enCours = true;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                parser.parseComplete(chunk);
                var title = domUtils.getElementsByTagName("title", handler.dom);
                if (title.length > 0) title = title[0].children[0].data; else title = null;

                if (enCours == true || null != title) {
                    enCours = false;
                    console.log("récupération du site :")
                    sitesRepository.update(lien, {$set: {titre: title, enCours: enCours} }, function(numberAffected) {
                        if (numberAffected > 0) {
                            console.log("site mis à jour.");
                        }
                    })
                }
            });
        }
    };

    var _create = function (req, res) {
        var newSite = req.body;

        newSite.titre = "Non trouvé ...";
        newSite.enCours = true;
        newSite.occurances = 1;

        sitesRepository.insert(newSite, function(site) {
            var options = {
                host: newSite.lien,
                path: "/"
            };

            http.request(options, callbackSite(newSite.lien)).on('error',function (e) {
                console.log('problem with request: ' + e.message);
                sitesRepository.update(site.lien, {$set: {titre: "problème d'accès à ce site !!!", enCours: false} }, function(numberAffected) {
                    if (numberAffected > 0) {
                        console.log("site en erreur mis à jour.");
                    }
                })
            }).end();


            res.status(201).send();
        })

    };

    var _getSites = function (req, res) {
        sitesRepository.find(null, null, null, function (sites) {
            res.status(200).send(JSON.stringify(sites));
        })

    };

    var _delete = function (req, res) {
        var siteToDelete = req.body;

        sitesRepository.delete(siteToDelete, function() {
            res.status(201).send();
        })

    };

    return {
        create: _create,
        getSites: _getSites,
        delete: _delete
    };

};

module.exports = SiteRoutes;