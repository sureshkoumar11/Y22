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
    const searchTerms = [
        document.getElementById("searchInput1").value.toLowerCase().trim(),
        document.getElementById("searchInput2").value.toLowerCase().trim(),
        document.getElementById("searchInput3").value.toLowerCase().trim(),
        document.getElementById("searchInput4").value.toLowerCase().trim(),
        document.getElementById("searchInput5").value.toLowerCase().trim(),
        document.getElementById("searchInput6").value.toLowerCase().trim()
    ];

    const table = document.getElementById("dataTable");
    const noSearchMessage = document.getElementById("noSearchMessage");

    console.log("🔍 Search terms:", searchTerms);

    if (searchTerms.every(term => term === "")) {
        noSearchMessage.style.display = "block"; // Show message
        table.style.display = "none"; // Hide table
        return;
    }

    noSearchMessage.style.display = "none"; // Hide message
    table.style.display = "none"; // Hide table before new results load

    const jsonData = await fetchExcelData();
    if (jsonData.length === 0) {
        console.warn("⚠️ No data available.");
        return;
    }

    const tableHead = document.getElementById("tableHead");
    const tableBody = document.getElementById("tableBody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    // Set table headers
    const headers = Object.keys(jsonData[0]);
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Filter and display data
    let filteredData = jsonData.filter(row => {
        let rowValues = Object.values(row).map(value => value.toString().toLowerCase());
        return searchTerms.every(term => term === "" || rowValues.some(value => value.includes(term)));
    });

    console.log("🔎 Filtered Results:", filteredData);

    if (filteredData.length === 0) {
        table.style.display = "block";
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

    table.style.display = "block"; // Show table
}
