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

// endpoint, get book by author, title and year. show info
const getBooks = (request, response) => {
  // somehow make this a varible thingy
  let filteredBooks = books;

  // check if it wants the author
  // .query functionality found on Developer.mozilla, a life saver
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/search/query
  if (request.query.author) {
    const authorSearch = request.query.author.toLowerCase();
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
      // if(filteredBooks[i].author.toLowerCase() === authorSearch.toLowerCase()){
      if (filteredBooks[i].author.toLowerCase().includes(authorSearch)) {
        // https://www.w3schools.com/jsref/jsref_includes.asp
        results.push(filteredBooks[i]);
      }
    }// end for loop

    filteredBooks = results;
  }// end request author

  // check if it wants the title
  // .query functionality found on Developer.mozilla, a life saver
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/search/query
  if (request.query.title) {
    const titleSearch = request.query.title.toLowerCase();
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
      // if(filteredBooks[i].title.toLowerCase() === titleSearch.toLowerCase()){
      if (filteredBooks[i].title.toLowerCase().includes(titleSearch)) { //
        // partial search. w3Schools https://www.w3schools.com/jsref/jsref_includes.asp
        results.push(filteredBooks[i]);
      }
    }// end for loop

    filteredBooks = results;
  }// end request title

  // check if it wants the year
  if (request.query.year) {
    const yearSearch = request.query.year;
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
    // took way too long to fix, this has to be string
      if (`${filteredBooks[i].year}` === `${yearSearch}`) {
        results.push(filteredBooks[i]);
      }
    }// end for loop

    filteredBooks = results;
  }// end request year

  const responseJSON = {
    books: filteredBooks,
  };
  respondJSON(request, response, 200, responseJSON);
};// end of getBooks

// endpoint, get book by author and year. show title
const getBookTitles = (request, response) => {
  // somehow make this a varible thingy
  let filteredBooks = books;

  // check if it wants the author
  // .query functionality found on Developer.mozilla, a life saver
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/search/query
  if (request.query.author) {
    const authorSearch = request.query.author.toLowerCase();
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
      // if(filteredBooks[i].author.toLowerCase() === authorSearch.toLowerCase()){
      if (filteredBooks[i].author.toLowerCase().includes(authorSearch)) {
        // https://www.w3schools.com/jsref/jsref_includes.asp
        results.push(filteredBooks[i]);
      }
    }// end for loop

    filteredBooks = results;
  }// end request author

  // check if it wants the year
  if (request.query.year) {
    const yearSearch = request.query.year;
    const results = [];

    for (let i = 0; i < filteredBooks.length; i++) {
    // took way too long to fix, this has to be string
      if (`${filteredBooks[i].year}` === `${yearSearch}`) {
        results.push(filteredBooks[i]);
      }
    }// end for loop

    filteredBooks = results;
  }// end request year

  const responseJSON = {
    bookTitles: filteredBooks,
  };
  respondJSON(request, response, 200, responseJSON);
};// end of getBooks

// endpoint, get book by page minimum and maximum length. show title and page count
const getBookLength = (request, response) => {
  // somehow make this a varible thingy
  const filteredBooks = books;

  // https://www.w3schools.com/jsref/jsref_parseint.asp
  // parse int
  const minPages = parseInt(request.query.min, 10);
  const maxPages = parseInt(request.query.max, 10);

  /// change this whole thing so that it acepts
  //  a minimum and maximum number of pages and searches between

  // https://www.w3schools.com/jsref/jsref_isnan.asp
  // is NaN
  if (Number.isNaN(minPages) && Number.isNaN(maxPages)) {
    const responseJSON = {
      message: 'Please provide at least a minimum or maximum page number.',
      id: 'missingParams',
    };
    respondJSON(request, response, 400, responseJSON);
  }

  const results = [];

  for (let i = 0; i < filteredBooks.length; i++) {
    const { pages } = filteredBooks[i];

    // typeof https://www.w3schools.com/js/js_typeof.asp
    if (typeof pages === 'number') {
      // if both exist
      if (!Number.isNaN(minPages) && !Number.isNaN(maxPages)) {
        if (pages >= minPages && pages <= maxPages) {
          results.push(filteredBooks[i]);
        }

      // if only min
      } else if (!Number.isNaN(minPages)) {
        if (pages >= minPages) {
          results.push(filteredBooks[i]);
        }

      // if only max
      } else if (!Number.isNaN(maxPages)) {
        if (pages <= maxPages) {
          results.push(filteredBooks[i]);
        }
      }
    }
  }// end of checking all that

  const responseJSON = {
    bookPages: results,
  };
  respondJSON(request, response, 200, responseJSON);
};// end of getBooks

// endpoint, get All books. show all book titles
const getAllBooks = (request, response) => {
  const responseJSON = {
    allBooks: books,
  };
  respondJSON(request, response, 200, responseJSON);
};// end of getBooks

// endpoint, this one will return a random book
const getRandomBook = (request, response) => {
// gotten from w3Schools https://www.w3schools.com/js/js_random.asp
  const randomNumber = Math.floor(Math.random() * books.length);

  const responseJSON = {

    book: books[randomNumber],
  };
  respondJSON(request, response, 200, responseJSON);
};// end of getRandomBook

// endpoint: this will add A book
// was heavily suggested to use this body component by an ai
const getNewBook = (request, response) => {
  const { body } = request;

  let responseJSON = {};

  // if missing stuff then error it .
  if (!body.title || !body.author || !body.year) {
    responseJSON = {
      message: 'Missing title, author, or year.',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);//
  }

  const newBook = {
    title: body.title,
    author: body.author,
    year: `${(body.year)}`, // ugh
  };

  books.push(newBook);
  responseJSON = {
    message: 'Book added!',
    book: newBook,
  };
  return respondJSON(request, response, 201, responseJSON);
};// end getNewBook

// endpoint: this will update a book's title or yar
// was heavily suggested to use this body component by an ai
const getUpdateBook = (request, response) => {
  // i needed the assistance of AI to figure out how to structure this for finding books
  // i apologize

  const { body } = request;

  const searchTitle = body.title.toLowerCase();
  // .find https://www.w3schools.com/jsref/jsref_find.asp
  const book = books.find((b) => b.title.toLowerCase() === searchTitle); // checks if true

  /// ^^^^ AI struture end

  // parameters werent given and dont exist
  if (!body.title || !body.year) {
    const responseJSON = {
      message: 'Missing title or year.',
      id: 'missingParams',
    };
    return respondJSON(request, response, 400, responseJSON);// end this is errored
  }

  // book wasnt found
  if (!book) {
    const responseJSON = {
      message: 'Book not found.',
      id: 'notFound',
    };
    // 404 means not found
    return respondJSON(request, response, 404, responseJSON);
  }

  if (body.author) book.author = body.author;
  if (body.year) book.year = body.year;

  const responseJSON = {
    message: 'Book updated succesfully.',
    book,
  };
  return respondJSON(request, response, 200, responseJSON);
};// end of getUpdateBook  // unfinished

// endpoint: this will return not found
const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The requested resource was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};// end of getNotFound // unfinished

module.exports = {
  getBooks,
  getBookTitles,
  getBookLength,
  getAllBooks,
  getRandomBook,
  getNewBook,
  getUpdateBook,
  getNotFound,

};
