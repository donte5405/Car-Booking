//@ts-check
/**
 * Formats a date object into Thai style: "date month year hour.minute น."
 * @param {Date} date - The date to format (defaults to current date/time if not provided)
 * @returns {string} The formatted date string in Thai format
 */
export function formatThaiDate(date = new Date()) {
    // Thai month names
    const thaiMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];

    // Get date components
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];

    // Convert to Thai Buddhist Era (BE) which is CE + 543
    const year = date.getFullYear() + 543;

    // Get time components
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Format the complete string
    return `${day} ${month} ${year} ${hours}.${minutes} น.`;
}

/**
 * Parses a Thai-formatted date string into a JavaScript Date object
 * Expected format: "date month year hour.minute น."
 * Example: "25 เมษายน 2568 14.30 น."
 *
 * @param {string} thaiDateString - The Thai-formatted date string to parse
 * @returns {Date} JavaScript Date object
 */
export function parseThaiDate(thaiDateString) {
    // Thai month names and their corresponding month index (0-based)
    const thaiMonths = {
        "มกราคม": 0, // January
        "กุมภาพันธ์": 1, // February
        "มีนาคม": 2, // March
        "เมษายน": 3, // April
        "พฤษภาคม": 4, // May
        "มิถุนายน": 5, // June
        "กรกฎาคม": 6, // July
        "สิงหาคม": 7, // August
        "กันยายน": 8, // September
        "ตุลาคม": 9, // October
        "พฤศจิกายน": 10, // November
        "ธันวาคม": 11, // December
    };

    // Remove the "น." suffix and split the string by spaces
    const cleanString = thaiDateString.replace(" น.", "");
    const parts = cleanString.split(" ");

    if (parts.length !== 4) {
        throw new Error(
            'Invalid Thai date format. Expected: "date month year hour.minute น."',
        );
    }

    // Extract date components
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const monthIndex = thaiMonths[monthName];

    if (monthIndex === undefined) {
        throw new Error(`Invalid Thai month name: ${monthName}`);
    }

    // Convert from Buddhist Era (BE) to CE/AD by subtracting 543
    const year = parseInt(parts[2], 10) - 543;

    // Extract time components
    const timeParts = parts[3].split(".");
    if (timeParts.length !== 2) {
        throw new Error('Invalid time format. Expected: "hour.minute"');
    }

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Create and return a new Date object
    const date = new Date(year, monthIndex, day, hours, minutes, 0);

    // Validate the parsed date
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date components resulted in an invalid date");
    }

    return date;
}
