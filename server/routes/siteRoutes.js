'use strict';

/**
 * Routes of the API
 * @class SiteRoutes
 * @constructor
 * @param {}
 * @module routes
 */
var SiteRoutes = function () {
    var http = require('http'),
        sys = require('sys'),
        htmlparser = require('htmlparser2'),
        domUtils = htmlparser.DomUtils;

    var SitesRepository = require('../core/sitesRepository')

    var connexionString = process.env.DB_USER + ':' + process.env.DB_PASSWD + '@' + process.env.DB_URL + '/yeoman-angular-express-db';

    var sitesRepository = new SitesRepository('mongodb://yo:yo@ds029778.mongolab.com:29778/yeoman-angular-express-db', 'sites');
//    var sitesRepository = new SitesRepository('mongodb://localhost:27017/test', 'sites');       ds029778.mongolab.com:29778/yeoman-angular-express-db
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
                    console.log("récupération du site :");
                    sitesRepository.update(lien, {$set: {titre: title, enCours: enCours} }, function(numberAffected) {
                        if (numberAffected > 0) {
                            console.log("site mis à jour avec le titre.");
                        }
                    });
                }
            });
        };
    };

    var _create = function (req, res) {
        var newSite = req.body;

        sitesRepository.update(newSite.lien, {$inc: { occurances: 1 }}, function(numberAffected) {
            if (numberAffected > 0) {
                console.log("site mis à jour !");
                sitesRepository.find({lien: newSite.lien}, null, null, function (sites) {
                    for (var i=0; i<sites.length; i++) {
                        console.log(sites[i].note);
                        console.log(sites[i].occurances);
                        console.log(newSite.note);

                        var somme = parseFloat(sites[i].note * (sites[i].occurances - 1)) + parseFloat(newSite.note);
                        var newNote = somme / parseInt(sites[i].occurances);
                        console.log("newNote :"+ newNote);

                        sitesRepository.update(newSite.lien, {$set: { note: newNote }}, function(numberAffected) {
                            console.log("note mis à jour :" + newNote);
                        });
                    }
                });
            } else {
                newSite.titre = "Non trouvé ...";
                newSite.enCours = true;
                newSite.occurances = 1;

                sitesRepository.insert(newSite, function(site) {
                    var options = {
                        host: newSite.lien,
                        path: "/"
                    };

                    var req = http.request(options, callbackSite(newSite.lien));

                    req.on('error',function (e) {
                        console.log('problem with request: ' + e.message);
                        sitesRepository.update(site.lien, {$set: {titre: "problème d'accès à ce site !!!", enCours: false} }, function(numberAffected) {
                            if (numberAffected > 0) {
                                console.log("site en erreur mis à jour.");
                            }
                        });
                    });

                    req.end();
                })
            }
        })


        console.log("res.status = 201");
        res.status(201).send();
    };

    var _getSites = function (req, res) {
        sitesRepository.find(null, null, null, function (sites) {
            res.status(200).send(JSON.stringify(sites));
        });

        console.log("end - getSite");

    };

    var _delete = function (req, res) {
        var siteToDelete = req.body;

        sitesRepository.delete(siteToDelete, function() {
            res.status(201).send();
        });

    };

    return {
        create: _create,
        getSites: _getSites,
        delete: _delete
    };

};

module.exports = SiteRoutes;