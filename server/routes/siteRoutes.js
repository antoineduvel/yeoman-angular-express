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

    var SitesRepository = require('../core/SitesRepository')

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
                    //TODO Récuperer le site concerné pour le mettre à jour
                    //TODO mutualiser le code du find. Cf plus bas
                    sitesRepository.find({ lien: lien }, null, null, function (sites) {
                        for (var i=0; i<sites.length;i++) {
                            if (null != title) sites[i].titre = title;
                            sites[i].enCours = enCours;
                            console.log(sites[i]);
                            sites[i].save(function (err) {
                                if (err) // ...
                                    console.log('erreur ...');
                            });
                        }
                    })
                }
            });
        }
    };

    var _create = function (req, res) {
        var newSite = req.body;

        sitesRepository.insert(newSite, function(site) {
            var options = {
                host: newSite.lien,
                path: "/"
            };

            http.request(options, callbackSite(newSite.lien)).on('error',function (e) {
                console.log('problem with request: ' + e.message);
                site.titre = "problème d'accès à ce site !!!" ;
                site.enCours = false;
                site.save(function (err) {
                    if (err) // ...
                        console.log('erreur ...');
                });
            }).end();


            res.status(201).send();
        })

    };

    var _getSites = function (req, res) {
        sitesRepository.find(null, null, null, function (sites) {
            res.status(200).send(JSON.stringify(sites));
        })

    };

    return {
        create: _create,
        getSites: _getSites
    };

};

module.exports = SiteRoutes;