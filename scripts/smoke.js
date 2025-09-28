const http = require('http');
const options = { hostname: 'localhost', port: 3000, path: '/api/items', method: 'GET' };

const req = http.request(options, res => {
  console.log(`status: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try{
      const j = JSON.parse(data);
      console.log('OK — items:', j.length);
    }catch(e){
      console.error('Invalid JSON');
    }
  });
});

req.on('error', err => {
  console.error('Request error:', err.message);
  process.exit(2);
});

req.end();
