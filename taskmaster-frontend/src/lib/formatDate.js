export default function formatDate(rawDate) {
  if (!rawDate) return "N/A";
  
  // Convert numeric strings or numbers into valid timestamps
  const timestamp = Number(rawDate);
  const dateInput = !Number.isNaN(timestamp) ? timestamp : rawDate;

  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return String(rawDate);

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}