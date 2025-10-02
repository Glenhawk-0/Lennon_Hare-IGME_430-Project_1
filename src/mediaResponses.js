const fs = require('fs');

const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

module.exports = {
  getCSS,

};
