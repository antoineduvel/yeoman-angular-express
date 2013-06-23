var SiteRoutes = require('../../../../server/routes/siteRoutes');

var routes

describe("siteRoutes", function() {

    var req = new Object(),
        res = new Object();

    req.body = new Object();
    req.body.lien = "www.angularjs.fr";
    req.body.note = 3;

    var sites;

    res.status = function(string) {
        console.log("____________________");
        console.log("status = " + string);
        var ret = new Object();
        ret.send = function(arg) {
            try {
                sites = JSON.parse(arg);
                console.log(sites);
            } catch (ex) {
                console.error("bad json: " + arg);
                return null;
            }
        };
        return ret;
    };

    beforeEach(function() {
        routes = new SiteRoutes();

        console.log("delete");
        routes.delete(req, res);
    });

    it("creates site", function() {
        console.log("create");
        routes.create(req, res);

        console.log("getSite");

        routes.getSites(req, res);
    });
});