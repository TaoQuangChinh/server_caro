const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.handle);

server.listen(process.env.PORT || 300);