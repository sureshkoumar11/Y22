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
document.getElementById("searchButton").addEventListener("click", searchData);

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

    if (searchTerms.every(term => term === "")) {
        document.getElementById("noSearchMessage").style.display = "block";
        document.getElementById("dataTable").style.display = "none";
        return;
    }

    document.getElementById("noSearchMessage").style.display = "none";
    document.getElementById("dataTable").style.display = "none";

    const jsonData = await fetchExcelData();
    if (!jsonData.length) {
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

    // Filter Data
    const filteredData = jsonData.filter(row => {
        const rowValues = Object.values(row).map(value => value.toString().toLowerCase());
        return searchTerms.every(term => term === "" || rowValues.some(value => value.includes(term)));
    });

    console.log("🔎 Filtered Results:", filteredData);

    if (!filteredData.length) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        document.getElementById("dataTable").style.display = "block";
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

    document.getElementById("dataTable").style.display = "block";
}
