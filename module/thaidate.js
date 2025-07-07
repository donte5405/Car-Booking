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
