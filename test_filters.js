// Test script to see what data comes back for each filter range
const fs = require('fs');
const ranges = ['5m', '1y', 'all'];
let output = '';

function log(msg) {
  output += msg + '\n';
}

async function testRange(range) {
  const today = new Date();
  let from;
  
  switch (range) {
    case '1y':
      from = new Date(today);
      from.setDate(from.getDate() - 365);
      break;
    case 'all':
      from = new Date(2020, 0, 1);
      break;
    case '5m':
    default:
      from = new Date(today);
      from.setDate(from.getDate() - 150);
      break;
  }
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  
  const body = {
    action: 'GET_DASHBOARD',
    ghlLocationId: 'PLsKcTpoijAF5iHuqikq',
    dateRange: { from: formatDate(from), to: formatDate(today) },
    userToken: 'default_token'
  };
  
  log(`\n${'='.repeat(80)}`);
  log(`TESTING RANGE: ${range}`);
  log(`Date range: ${body.dateRange.from} to ${body.dateRange.to}`);
  log(`${'='.repeat(80)}`);
  
  try {
    const res = await fetch('https://n8n.growtzy.com/webhook/api/v1/gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    
    if (data.success && data.payload) {
      const p = data.payload;
      
      log('\n--- KPIs ---');
      log(JSON.stringify(p.kpis, null, 2));
      
      log('\n--- Funnel ---');
      log(JSON.stringify(p.funnel, null, 2));
      
      log('\n--- SalesByChannel ---');
      log(JSON.stringify(p.salesByChannel, null, 2));
      
      log('\n--- Lead Conversion Trends ---');
      const lct = p.charts?.lead_conversion_trends || [];
      log(`  Total months: ${lct.length}`);
      log(JSON.stringify(lct, null, 2));
      
      log('\n--- Cluster Data ---');
      const cd = p.charts?.cluster_data || [];
      log(`  Total points: ${cd.length}`);
      if (cd.length > 3) {
        log(`  First 3: ${JSON.stringify(cd.slice(0, 3), null, 2)}`);
      } else {
        log(JSON.stringify(cd, null, 2));
      }
      
      log('\n--- Win Rate By Source ---');
      log(JSON.stringify(p.charts?.win_rate_by_source, null, 2));
      
      log('\n--- Pipeline Value ---');
      log(JSON.stringify(p.charts?.pipeline_value_by_stage, null, 2));
      
      log('\n--- Products ---');
      log(JSON.stringify(p.products, null, 2));
      
      log('\n--- Intelligence Report ---');
      log(JSON.stringify(p.intelligenceReport, null, 2));
      
    } else {
      log('ERROR: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    log('FETCH ERROR: ' + err.message);
  }
}

(async () => {
  for (const r of ranges) {
    await testRange(r);
  }
  fs.writeFileSync('test_filters_output.txt', output);
  console.log('Done - written to test_filters_output.txt');
})();
