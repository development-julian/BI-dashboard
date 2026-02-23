const https = require('https');

const data = JSON.stringify({});

const reqOptions = {
    hostname: 'n8n.growtzy.com',
    port: 443,
    path: `/api/v1/workflows/3vr1yqZS0HMXl8oI/execute`,
    method: 'POST',
    headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MGM4NDgxYi02MzMzLTQ0MTAtYTA3MC1mYmQ5ZjliNzFhODciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcxNzkyNjQwLCJleHAiOjE3Nzk1MDg4MDB9.sB-0KfPcaIDP0b4HVhWTArGbAv6qpZfQ35Hom1sjeAE',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(reqOptions, (res) => {
    let resData = '';
    res.on('data', chunk => resData += chunk);
    res.on('end', () => {
        try {
            console.log(JSON.stringify(JSON.parse(resData), null, 2));
        } catch (e) {
            console.log('Error / Raw:', resData);
        }
    });
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
