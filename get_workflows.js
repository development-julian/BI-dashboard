const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'n8n.growtzy.com',
    port: 443,
    path: '/api/v1/workflows',
    method: 'GET',
    headers: {
        'X-N8N-API-KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MGM4NDgxYi02MzMzLTQ0MTAtYTA3MC1mYmQ5ZjliNzFhODciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcxNzkyNjQwLCJleHAiOjE3Nzk1MDg4MDB9.sB-0KfPcaIDP0b4HVhWTArGbAv6qpZfQ35Hom1sjeAE',
        'Accept': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const items = json.data || json.items || [];
            console.log("Found workflows:");
            items.forEach(w => console.log(`${w.id} - ${w.name}`));
        } catch (e) {
            console.log('Error parsing:', e);
            fs.writeFileSync('workflows.json', data);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
