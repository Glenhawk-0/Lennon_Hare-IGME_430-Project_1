// i used piceces of code from the week 3 examples as a baseline.
// ill be honest though, i like... kinda half understand how it works.
// i apologize.
const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');
const jsonHandler = require('./jsonResponses.js');

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;


//parseBody
const parseBody = (request, response, handler) => {
  // The request will come in in pieces. We will store those pieces in this
  // body array.
  const body = [];

  // The body reassembly process is event driven, much like when we are streaming
  // media like videos, etc. We will set up a few event handlers. This first one
  // is for if there is an error. If there is, write it to the console and send
  // back a 400-Bad Request error to the client.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // The second possible event is the "data" event. This gets fired when we
  // get a piece (or "chunk") of the body. Each time we do, we will put it in
  // the array. We will always recieve these chunks in the correct order.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // The final event is when the request is finished sending and we have recieved
  // all of the information. When the request "ends", we can proceed. Turn the body
  // array into a single entity using Buffer.concat, then turn that into a string.
  // With that string, we can use the querystring library to turn it into an object
  // stored in bodyParams. We can do this because we know that the client sends
  // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);

    // Once we have the bodyParams object, we will call the handler function. We then
    // proceed much like we would with a GET request.
    handler(request, response);
  });
};



// key:value object to look up URL routes to specific functions
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': mediaHandler.getCSS,
  '/docs.html': htmlHandler.getDocs,
  '/api/books': jsonHandler.getBooks,
  '/api/books/random': jsonHandler.getRandomBook,
  '/api/books/titles': jsonHandler.getBookTitles,
  '/api/books/pages': jsonHandler.getBookLength,
  '/api/books/all': jsonHandler.getAllBooks,
  // -- add ones are different
  //
  // i have no idea how to add these ones yet.. im sorry
  // aparently it need some kind of parse body thinng and i have no idea
  // what that is and im not gonna just copy paste AI
  // im going to just have place holder things for now.

    '/api/books/add': (request, response) => { 
    parseBody(request, response, jsonHandler.getNewBook);
    },
    '/api/books/update': (request, response) => {
    parseBody(request, response, jsonHandler.getUpdateBook);
    },
  //--
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
  // request.acceptedTypes = request.headers.accept.split(',');
  //  // needs to be an if statement now
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
