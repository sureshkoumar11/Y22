async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22/main/data.xlsx"; // Ensure URL is correct
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        console.log("✅ Loaded Excel Data:", jsonData);
        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        return [];
    }
}
async function searchData() {
    // Read all six search inputs
    const searchTerms = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim()
    ];

    console.log("🔍 Search terms:", searchTerms);

    // Hide table if no search term is entered
    if (searchTerms.every(term => term === "")) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";

    // Fetch the Excel data
    const jsonData = await fetchExcelData();
    if (jsonData.length === 0) {
        console.warn("⚠️ No data available.");
        return;
    }

    // Filter data based on all six search inputs
    const filteredData = jsonData.filter(row => {
        const rowValues = Object.values(row).map(value => value.toString().toLowerCase());
        
        return searchTerms.every(term => 
            term === "" || rowValues.some(value => value.includes(term))
        );
    });

    console.log("🔎 Filtered Data:", filteredData);

    // Display table and handle no results case
    const table = document.getElementById("dataTable");
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear previous results

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        table.style.display = "block";
        return;
    }

    // Generate table headers
    const tableHead = document.getElementById("tableHead");
    tableHead.innerHTML = ""; 
    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Populate table with filtered data
filteredData.forEach(row => {
    const tr = document.createElement("tr");
    let highlightRow = false; // Flag to check if "CGPA" is present

    headers.forEach(header => {
        const td = document.createElement("td");
        td.textContent = row[header];

        // Check if the cell contains "CGPA"
        if (td.textContent.toLowerCase().includes("cgpa")) {
            highlightRow = true;
        }

        tr.appendChild(td);
    });

    // Apply yellow background if "CGPA" is found in the row
    if (highlightRow) {
        tr.style.backgroundColor = "yellow";
    }

    tableBody.appendChild(tr);
});
