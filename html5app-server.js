var express = require('express'),
    app = express();

//initialize static server that will spit out contents of public folder
app.use('/', function(){
    var staticPath = __dirname + '/',
        req = arguments[0];

    if(/_escaped_fragment_=/.test(req.url)){ // testing if url contains '_escaped_fragment_=' part
        req.url = req.url.replace(/\?.*$/,'').replace(/\/+$/,''); // if it does, then strip it

        // if url became empty then it means 'http://someurl/?_escaped_fragment_=' was requested,
        // so we need to return pre-rendered index.html, otherwise we should add '.html' extension
        // so that it would return 'posts.html' when http://someurl/posts?_escaped_fragment_= is requested
        req.url += (req.url === '') ? '/index.html' : '.html';
        staticPath += 'snapshots'; // making '/snapshots' the base directory of our static server
    } else {
        staticPath += 'public'; // if it's a regular link, then initialize static server in '/public' directory
    }
    express.static(staticPath).apply(this, arguments);
});

//send our main angular html file if any link without dot is requested, e.g. 'http://someurl/about'
//this is our actual server side redirect, we don't send index.html when there's dot in link assuming such a request
//is for static data like .js, .css or .html
app.get('/[^\.]+$', function(req, res){
    res.set('Content-Type', 'text/html')
        .sendfile(__dirname + '/public/index.html');
});

app.listen(9823); //the express server will start on port 9823
console.log('started');
