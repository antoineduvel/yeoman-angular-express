var SiteRoutes = require('../../server/routes/siteRoutes');

var routes

describe("siteRoutes", function() {

    beforeEach(function() {
        routes = new SiteRoutes();
    });

    it("creates site", function() {
        var req = new Object(),
            res = new Object();

        req.body = new Object();
        req.body.lien = "www.google.fr";
        req.body.commentaire = "moteur de recherche";

        var sites;

        res.status = function(string) {
            console.log("status = " + string);
            var ret = new Object();
            ret.send = function(arg) {
                try {
                    sites = JSON.parse(arg);
                } catch (ex) {
                    console.error("bad json: " + arg);
                }
                console.log(sites)
            };
            return ret;
        }

        spyOn(res, 'status').andCallThrough();

        routes.create(req, res);
        routes.getSites(req, res);

        expect(res.status).toHaveBeenCalled();
    });
});