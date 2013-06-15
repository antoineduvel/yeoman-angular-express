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

    var handler = new htmlparser.DomHandler();

    var parser = new htmlparser.Parser(handler);

    var callbackSite = function (a) {
        return function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                parser.parseComplete(chunk);
                var title = domUtils.getElementsByTagName("title", handler.dom);
                if (title.length > 0) title = title[0].children[0].data; else title = null;
                if (null != title) {
                    console.log("title : ", title);
                    console.log("TODO : mettre à jour sites[" + (a - 1) + "]");
                    if (sites.length >= a) {
                        var site = null;
                        site = sites[a - 1];
                        site.title = title;
                        sites[a - 1] = site;
                        console.log("site : ", site);

                    }

                }
            });
        }
    };
    var sites;
    sites = [];

    var _create = function (req, res) {
        var newSite = req.body;

        var options = {
            host: newSite.link,
            path: "/"
        };

        newSite.title = "inconnu. en cours de recherche ...";
        sites.push(newSite);

        http.request(options, callbackSite(sites.length)).on('error',function (e) {
            console.log('problem with request: ' + e.message);
        }).end();


        res.status(201).send();
    };

    var _getSites = function (req, res) {
        res.status(200).send(JSON.stringify(sites));
    };

    return {
        create: _create,
        getSites: _getSites
    };

};

module.exports = SiteRoutes;