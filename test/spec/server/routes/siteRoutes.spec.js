var SiteRoutes = require('../../../../server/routes/siteRoutes');

describe("siteRoutes", function() {

    var req = new Object(),
        res = new Object();

    req.body = new Object();
    req.body.lien = "www.angularjs.fr";
    req.body.tags = [{name: "javascript"}];
    req.body.note = 3;

    var sites;
    var routes = new SiteRoutes();

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
        waits(1000);
    });

    it("creates site", function() {
        console.log("spec : delete");
        routes.delete(req, res);

        console.log("spec : create");
        routes.create(req, res);

        console.log("spec : getSite");

        routes.getSites(req, res);
    });
});