/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the CSV file (without extension)
 * @param {Array} columns - Optional array of column definitions { key, label }
 */
export const exportToCSV = (data, filename = "export", columns = null) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // If columns not provided, use all keys from first object
  let headers = [];
  let keys = [];

  if (columns && columns.length > 0) {
    headers = columns.map((col) => col.label);
    keys = columns.map((col) => col.key);
  } else {
    keys = Object.keys(data[0]);
    headers = keys;
  }

  // Build CSV content
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const value = row[key];

      // Handle null/undefined
      if (value === null || value === undefined) {
        return "";
      }

      // Convert to string
      let cellValue = String(value);

      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (
        cellValue.includes(",") ||
        cellValue.includes("\n") ||
        cellValue.includes('"')
      ) {
        cellValue = `"${cellValue.replace(/"/g, '""')}"`;
      }

      return cellValue;
    });

    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export data to CSV with custom formatting
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the CSV file
 * @param {Function} formatter - Function to format each row
 */
export const exportToCSVWithFormatter = (data, filename, formatter) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const formattedData = data.map(formatter);
  const keys = Object.keys(formattedData[0]);
  const headers = keys.map((key) => key.replace(/([A-Z])/g, " $1").trim());

  const columns = keys.map((key, index) => ({
    key,
    label: headers[index],
  }));

  exportToCSV(formattedData, filename, columns);
};

export default exportToCSV;
