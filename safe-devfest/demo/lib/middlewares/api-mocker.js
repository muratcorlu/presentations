var fs = require('fs');

module.exports = function (urlRoot, pathRoot, speedLimit) {
    pathRoot = pathRoot.replace(urlRoot, '');
    if (!speedLimit) {
      speedLimit = 0; // Unlimited
    }
    return function(req, res, next){
        if (req.url.indexOf(urlRoot) === 0) {
            // Ignore querystrings
            url = req.url.split('?')[0];

            fs.readFile('./' + pathRoot + url + '/'+req.method+'.json', function(err, buf){
                if (err) return next(err);

                resp = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': buf.length
                    },
                    body: buf
                };
                res.writeHead(200, resp.headers);

                if (speedLimit) {
                    setTimeout(function() {
                        res.end(resp.body);
                    }, buf.length / (speedLimit * 1024 / 8 ) * 1000);
                } else {
                    res.end(resp.body);
                }
            });
        } else {
            next();
        }
    };
};
