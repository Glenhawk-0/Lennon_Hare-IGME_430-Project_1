
const fs = require('fs'); // pull in the file system module



const books = JSON.parse(fs.readFileSync(`${__dirname}/data/books.json`));