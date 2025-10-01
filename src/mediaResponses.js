
const fs = require('fs');


const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// placeholder in case you add client.js later //ai suggested this
const getClientJS = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('client.js not found yet');
  response.end();
};// hmmmm what is this???

module.exports = {
  getCSS,
  getClientJS,
};