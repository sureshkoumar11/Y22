let jsonData = [];

document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        console.log("✅ Excel Data Loaded:", jsonData); // Debugging log
        alert("Excel file loaded successfully!");
    };
});

function searchData() {
    const searchTerm1 = document.getElementById("searchInput1").value.toLowerCase();
    const searchTerm2 = document.getElementById("searchInput2").value.toLowerCase();
    const searchTerm3 = document.getElementById("searchInput3").value.toLowerCase();

    console.log("🔍 Searching for:", searchTerm1, searchTerm2, searchTerm3); // Debugging log

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (jsonData.length === 0) {
        console.warn("⚠️ No data loaded. Please upload an Excel file first!");
        tableBody.innerHTML = "<tr><td colspan='100%'>No data loaded.</td></tr>";
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
        (!searchTerm1 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm1))) &&
        (!searchTerm2 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm2))) &&
        (!searchTerm3 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm3)))
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
