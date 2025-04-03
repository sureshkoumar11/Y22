async function fetchExcelData() {
    try {
        const url = "https://raw.githubusercontent.com/sureshkoumar11/Y22/main/data.xlsx"; 
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Excel file");

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        // Convert the first sheet into JSON format
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        console.log("✅ Excel Data Loaded:", jsonData);
        return jsonData;
    } catch (error) {
        console.error("❌ Error loading Excel file:", error);
        return [];
    }
}

async function searchData() {
    const searchTerms = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim()
    ];

    console.log("🔍 Search terms:", searchTerms);

    // Hide table if no search terms
    if (searchTerms.every(term => term === "")) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";

    // Fetch Excel data
    const jsonData = await fetchExcelData();
    if (jsonData.length === 0) {
        console.warn("⚠️ No data available.");
        return;
    }

    const filteredData = jsonData.filter(row => {
        const rowValues = Object.values(row).map(value => value.toString().toLowerCase());
        return searchTerms.every(term => term === "" || rowValues.some(value => value.includes(term)));
    });

    console.log("🔎 Filtered Data:", filteredData);

    // Get table elements
    const table = document.getElementById("dataTable");
    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");

    // Clear previous results
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        table.style.display = "block";
        return;
    }

    // Generate table headers
    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Populate table rows
    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        let highlightRow = false; 

        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header];

            // Highlight rows containing "CGPA"
            if (td.textContent.trim().toLowerCase() === "cgpa") {
                highlightRow = true;
            }

            tr.appendChild(td);
        });

        if (highlightRow) {
            tr.classList.add("highlight-row");
        }

        tableBody.appendChild(tr);
    });

    table.style.display = "block";
}
