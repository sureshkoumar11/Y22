const excelUrl = "https://raw.githubusercontent.com/sureshkoumar11/Y22/main/data.xlsx";
let excelData = {};

async function fetchExcelData() {
    const response = await fetch(excelUrl);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    workbook.SheetNames.slice(0, 10).forEach(sheetName => {
        excelData[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    console.log("✅ Loaded Excel Data:", excelData);
}

async function searchData(sheetName, searchTerm, tableId) {
    if (!excelData[sheetName]) {
        console.warn(`⚠️ No data found for sheet: ${sheetName}`);
        return;
    }

    const tableHead = document.getElementById(`tableHead-${tableId}`);
    const tableBody = document.getElementById(`tableBody-${tableId}`);
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    let jsonData = excelData[sheetName];
    const headers = Object.keys(jsonData[0] || {});

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    let filteredData = jsonData.filter(row => 
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm))
    );

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        return;
    }

    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

document.addEventListener("DOMContentLoaded", fetchExcelData);
