// Express Import
const fs = require('fs');
const path = require('path');


// My functions
// Render Page Not Found
function notFound(res) {
  fs.readFile(path.join(__dirname, 'views',  '404.html'), (err, data) => {
    const html = data.toString();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
};

module.exports.notFound = notFound;