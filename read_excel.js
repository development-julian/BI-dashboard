const xlsx = require('xlsx');
const wb = xlsx.readFile('src/references/VASANNA_Ventas_Consolidado.xlsx');
wb.SheetNames.forEach(name => {
    console.log("=== Sheet:", name, "===");
    const data = xlsx.utils.sheet_to_json(wb.Sheets[name], { header: 1 });
    console.log(data.slice(0, 10)); // first 10 rows
});
