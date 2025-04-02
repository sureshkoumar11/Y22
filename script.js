let jsonData = [];

// Auto-load Excel file on page load
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 JavaScript Loaded!");
    await fetchExcelData();
});

async function fetchExcelData() {
    const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22/main/data.xlsx"; // Fixed URL
    try {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log("✅ Loaded Excel Data:", jsonData);

        if (jsonData.length > 0) {
            displayAllData(); // Show full data when page loads
        }
    } catch (error) {
        console.error("❌ Failed to load Excel file!", error);
        alert("Failed to load Excel data. Check file URL.");
    }
}

function searchData() {
    console.log("🔍 Searching...");
    
    const searchInput1 = document.getElementById("searchInput1").value.toLowerCase();
    const searchInput2 = document.getElementById("searchInput2").value.toLowerCase();
    const searchInput3 = document.getElementById("searchInput3").value.toLowerCase();

    if (jsonData.length === 0) {
        alert("⚠️ Data is not loaded yet. Please wait.");
        return;
    }

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    const filteredData = jsonData.filter(row =>
        (!searchInput1 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchInput1))) &&
        (!searchInput2 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchInput2))) &&
        (!searchInput3 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchInput3)))
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

    console.log("✅ Search completed!");
}

function displayAllData() {
    console.log("📊 Displaying all data...");

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    jsonData.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
