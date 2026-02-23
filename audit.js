const fs = require('fs');

const N8N_WEBHOOK_URL = 'https://n8n.growtzy.com/webhook/api/v1/gateway';

async function fetchData(action, days) {
    const to = new Date('2026-02-22T00:00:00Z');
    const from = new Date(to);
    from.setDate(to.getDate() - days);

    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action,
            ghlLocationId: "PLsKcTpoijAF5iHuqikq",
            dateRange: { from: fromStr, to: toStr }
        })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
    }
    return await res.json();
}

async function run() {
    try {
        const data7d = await fetchData('GET_DASHBOARD', 7);
        const data30d = await fetchData('GET_DASHBOARD', 30);
        const data90d = await fetchData('GET_DASHBOARD', 90);

        fs.writeFileSync('audit_7d.json', JSON.stringify(data7d, null, 2));
        fs.writeFileSync('audit_30d.json', JSON.stringify(data30d, null, 2));
        fs.writeFileSync('audit_90d.json', JSON.stringify(data90d, null, 2));
        console.log("Audit data saved.");
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

run();
