async function fetchExcelData() {
    const url = "https://github.com/sureshkoumar11/Y22/blob/main/data.xlsx"; // Replace with your GitHub raw file URL
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}
async function fetchExcelData() {
    const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22/main/data.xlsx"; // Make sure this is correct
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    
    console.log("✅ Loaded Excel Data:", jsonData); // Debugging log
    return jsonData;
}

async function searchData() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const jsonData = await fetchExcelData();

    console.log("🔍 Searching for:", searchTerm); // Debugging log
    console.log("📄 Excel Data:", jsonData); // Debugging log

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (jsonData.length === 0) {
        console.warn("⚠️ No data found in the Excel file!");
        tableBody.innerHTML = "<tr><td colspan='100%'>No data found.</td></tr>";
        return;
    }

    // Set table headers
    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Filter and display data
    let filteredData = jsonData.filter(row => 
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm))
    );

    console.log("🔎 Filtered Results:", filteredData); // Debugging log

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
