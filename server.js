var http = require('http');
var fs = require('fs');

function call_arduino(response) {
    var body = '';
    console.log('Calling Arduino');
    http.get('http://arduino', function (hcres) {
        hcres.setTimeout(7000, function () {
            console.log('Timeout hit');
            response.writeHead(200, {'Content-type': 'text-plain'});
            response.write('Unable to connect to remote server. Timeout hit.');
            response.end();
        });

        hcres.on('data', function(chunk) {
            body += chunk;
            console.log(body);
        });

        hcres.on('end', function() {
            response.writeHead(200, {'Content-type': 'text-plain'});
            response.write(body);
            console.log('end');
            response.end();
        });

    }).on('error', function(error) {
            console.log(error.message);
            response.writeHead(200, {'Content-type': 'text-plain'});
            response.write(error.toString());
            response.end();
    });
}

function onRequest(request, response) {
    if (request.method == 'GET' && request.url.match(/^\/arduino/)) {
        console.log('request.url = ' + request.url);
        call_arduino(response);
    }
    else if (request.method == 'GET') {
        displayForm(response);
    }
}

function displayForm(response) {
    fs.readFile('form.htm', function (err, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        response.write(data);
        response.end();
    });
}

http.createServer(onRequest).listen(process.env.PORT || 3000);
console.log('Listening for requests on port ' + (process.env.PORT || 3000));
