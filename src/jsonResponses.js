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
// got to add alot more to this, varible searches
const getBooks = (request, response) => {
  //somehow make this a varible thingy
  let filteredBooks = books;

  //check if it wants the author
  //.query functionality found on Developer.mozilla, a life saver
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/search/query
  if (request.query.author) { 
    const authorSearch = request.query.author.toLowerCase(); // was causing problems without the to lowercase. 
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
    
      //if(filteredBooks[i].author.toLowerCase() === authorSearch.toLowerCase()){
      if(filteredBooks[i].author.toLowerCase().includes(authorSearch)){//using includes for partial search. w3Schools
        //https://www.w3schools.com/jsref/jsref_includes.asp
        results.push(filteredBooks[i]);
      }

    }//end for loop

    filteredBooks = results;
  }//end request author
  


  //check if it wants the year
  if (request.query.year) { 
    const yearSearch = `${request.query.year}` ;//took way too long to fix, this has to be string
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
    
      if(filteredBooks[i].year === yearSearch){
        results.push(filteredBooks[i]);
      }

    }//end for loop

    filteredBooks = results;
  }//end request year


  
  
  const responseJSON = {
    books: filteredBooks,
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
