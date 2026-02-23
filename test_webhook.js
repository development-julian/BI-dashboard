const https = require('https');

const req = https.get('https://n8n.growtzy.com/webhook/1d17f526-9d55-46aa-ac9b-0014e7a898b8', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2)));
});

req.on('error', e => console.error(e));
