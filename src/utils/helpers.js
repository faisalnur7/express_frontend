export function convertToNorwayTime(isoTimestamp) {
  const date = new Date(isoTimestamp);

  // Format date in Norway's style: DD.MM.YYYY
  const formattedDate = date.toLocaleDateString("nb-NO", {
    timeZone: "Europe/Oslo",
  });

  // Format time in 24-hour format with seconds
  const formattedTime = date.toLocaleTimeString("nb-NO", {
    timeZone: "Europe/Oslo",
    hour12: false,
  });

  // Combine date and time
  return `${formattedDate} ${formattedTime}`;
}
export function exportArrayAsJSON(array, fileName = "data.json") {
  if (!Array.isArray(array)) {
    throw new Error("Input is not a valid array.");
  }

  const jsonString = JSON.stringify(array, null, 2); // Format JSON with 2 spaces indentation
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}