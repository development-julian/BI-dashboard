const https = require('https');
const fs = require('fs');

const data = fs.readFileSync('new_workflow.json', 'utf8');
const obj = JSON.parse(data);

const payloadString = JSON.stringify({
    name: obj.name,
    nodes: obj.nodes,
    connections: obj.connections,
    settings: obj.settings
});

const reqOptions = {
    hostname: 'n8n.growtzy.com',
    port: 443,
    path: `/api/v1/workflows/${obj.id}`,
    method: 'PUT',
    headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MGM4NDgxYi02MzMzLTQ0MTAtYTA3MC1mYmQ5ZjliNzFhODciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcxNzkyNjQwLCJleHAiOjE3Nzk1MDg4MDB9.sB-0KfPcaIDP0b4HVhWTArGbAv6qpZfQ35Hom1sjeAE',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payloadString)
    }
};

const req = https.request(reqOptions, (res) => {
    let resData = '';
    res.on('data', chunk => resData += chunk);
    res.on('end', () => console.log('Update Status:', res.statusCode, resData));
});

req.on('error', e => console.error('Upload Error:', e));
req.write(payloadString);
req.end();
