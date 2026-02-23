const https = require('https');

const body = JSON.stringify({
    action: 'GET_DASHBOARD',
    ghlLocationId: 'PLsKcTpoijAF5iHuqikq',
    dateRange: { from: '2026-01-23', to: '2026-02-23' }
});

const options = {
    hostname: 'n8n.growtzy.com',
    port: 443,
    path: '/webhook/api/v1/gateway',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const fs = require('fs');
        fs.writeFileSync('real_payload.json', data);
        console.log('Saved full payload to real_payload.json');
        console.log('Status:', res.statusCode);
        console.log('Size:', data.length, 'bytes');
    });
});

req.on('error', e => console.error('Error:', e.message));
req.write(body);
req.end();
