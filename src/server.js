// i used piceces of code from the week 3 examples as a baseline.
// ill be honest though, i like... kinda half understand how it works.
// i apologize.
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const jsonHandler = require('./jsonResponses.js')

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': mediaHandler.getCSS,
  '/client.js': mediaHandler.getClientJS,
  '/docs.html': htmlHandler.getDocs,
  '/api/books': jsonHandler.getBooks,
  // ...
  notFound: jsonHandler.getNotFound, // default
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects
const onRequest = (request, response) => {
  // parse the url using the built in URL class. Can make sure this supports http and https
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // grab the query parameters (?key=value&key2=value2&etc=etc)
  // and parse them into a reusable object by field name
  // store that in the request as the query
  request.query = Object.fromEntries(parsedUrl.searchParams);

  // grab the 'accept' headers (comma delimited) and split them into an array
  // store them inside of the request object for use in handler functions
  // request.acceptedTypes = request.headers.accept.split(','); // needs to be an if statement now
  if (request.headers.accept) {
    request.acceptedTypes = request.headers.accept.split(',');
  } else {
    request.acceptedTypes = [];
  }

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

// start HTTP server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});

/// //
