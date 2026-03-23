const fs = require('fs');

async function testFetch() {
  try {
    const res = await fetch('https://n8n.growtzy.com/webhook/api/v1/gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "GET_DASHBOARD",
        ghlLocationId: "PLsKcTpoijAF5iHuqikq",
        dateRange: { from: "2026-02-22", to: "2026-03-22" },
        userToken: "default_token"
      })
    });
    
    if (!res.ok) {
      console.error("HTTP Error", res.status, await res.text());
      return;
    }
    
    const text = await res.text();
    fs.writeFileSync('live_payload.json', text);
    console.log("Saved live_payload.json");
  } catch (err) {
    console.error(err);
  }
}

testFetch();
