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
    const tableBody = document.getElementById("tableBody");

    const jsonData = await fetchExcelData();

    if (jsonData.length === 0) {
        console.warn("⚠️ No data available.");
        return;
    }

    const filteredData = jsonData.filter(row => {
        return searchTerms.some(term => 
            term !== "" && Object.values(row).some(value => value.toString().toLowerCase().includes(term))
        );
    });

    console.log("🔎 Filtered Data:", filteredData);

    if (filteredData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='100%'>No matching results found.</td></tr>";
        table.style.display = "block";
        return;
    }

    tableBody.innerHTML = "";
    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        Object.values(row).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    table.style.display = "block";
}
