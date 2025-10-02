const fs = require('fs'); // pull in the file system module
// const { request } = require('http');
// const path = require('path');

const books = JSON.parse(fs.readFileSync(`${__dirname}/../dataset/books.json`));

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // Headers contain our metadata. HEAD requests only get
  // this information back, so that the user can see what
  // a GET request to a given endpoint would return. Here
  // they would see what format of data (JSON) and how big
  // that data would be ('Content-Length')
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'), // does that utf8 stay?
  };

  // send response with json object
  response.writeHead(status, headers);

  // HEAD requests don't get a body back, just the metadata.
  // So if the user made one, we don't want to write the body.
  if (request.method !== 'HEAD') { // not sure if this is needed.
    response.write(content);
  }//

  response.end();
};// end of respondJSON

// return Book object as JSON
const getBooks = (request, response) => {
  const responseJSON = {
    books,
  };
  respondJSON(request, response, 200, responseJSON);
};

// notFound
const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The requested resource was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getBooks,
  getNotFound,

};
