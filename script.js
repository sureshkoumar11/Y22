let jsonData = [];

// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput) {
        console.error("❌ fileInput element not found!");
        return;
    }

    fileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            console.log("✅ Excel Data Loaded:", jsonData);
            alert("Excel file loaded successfully!");
        };
    });
});

function searchData() {
    // Ensure the input fields exist before accessing them
    const searchInput1 = document.getElementById("searchInput1");
    const searchInput2 = document.getElementById("searchInput2");
    const searchInput3 = document.getElementById("searchInput3");

    if (!searchInput1 || !searchInput2 || !searchInput3) {
        console.error("❌ One or more search input fields not found!");
        return;
    }

    const searchTerm1 = searchInput1.value.toLowerCase();
    const searchTerm2 = searchInput2.value.toLowerCase();
    const searchTerm3 = searchInput3.value.toLowerCase();

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (jsonData.length === 0) {
        alert("⚠️ No data loaded. Please upload an Excel file first!");
        return;
    }

    // Set table headers
    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Filter data
    let filteredData = jsonData.filter(row =>
        (!searchTerm1 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm1))) &&
        (!searchTerm2 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm2))) &&
        (!searchTerm3 || Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm3)))
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
