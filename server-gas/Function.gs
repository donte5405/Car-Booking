const appUrl = ScriptApp.getService().getUrl();
const currentYearString = `${new Date().getFullYear()}`;

function getCurrentAppUrl() {
  return ScriptApp.getService().getUrl();
}

function getSpreadsheet() {
  let tries = 0;
  while (tries < 3) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch {
      Utilities.sleep(tries * 1000 + 1000 * Math.random());
      tries ++;
    }
  }
  return null;
}

/**
 * @param {number} xfrom
 * @param {number} xto
 * @param {number} yfrom
 * @param {number} yto
 * @returns {boolean}
 */
function isOverlapped(xfrom, xto, yfrom, yto) {
    // Handle cases where ranges might be defined in reverse order
    const x1 = Math.min(xfrom, xto);
    const x2 = Math.max(xfrom, xto);
    const y1 = Math.min(yfrom, yto);
    const y2 = Math.max(yfrom, yto);
    
    // Check if ranges overlap
    // Ranges overlap if: start of one is less than end of other AND
    // start of other is less than end of first
    return x1 < y2 && y1 < x2;
}

function shortenThaiName(fullName) {
  // Trim whitespace and check if name exists
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }
  
  let trimmedName = fullName.trim();
  if (!trimmedName) {
    return '';
  }
  
  // Remove common Thai name titles
  const thaiTitles = ['นาย', 'นางสาว', 'น.ส.', 'นส.', 'นส ', 'นาง', 'ดร.', 'ดร ', 'อาจารย์', 'ครู'];
  
  for (const title of thaiTitles) {
    // Use case-insensitive matching and ensure we match whole words
    const regex = new RegExp(`^${title.replace(/\./g, '\\.')}\\s+`, 'i');
    if (regex.test(trimmedName)) {
      trimmedName = trimmedName.replace(regex, '').trim();
      break; // Only remove one title
    }
  }
  
  if (!trimmedName) {
    return '';
  }
  
  // Split the name by spaces
  const nameParts = trimmedName.split(/\s+/);
  
  // If only one part, return as is
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1]; // Take the last part as surname
  
  // Thai frontal vowels that should be ignored
  const frontalVowels = ['เ', 'โ', 'ใ', 'ไ'];
  
  // High tone indicator consonants
  const highToneIndicators = ['ห', 'อ'];
  const sonorants = ['น', 'ม', 'ย', 'ร', 'ล', 'ว']; // consonants that can follow ห/อ as tone indicators
  
  // Find the first actual consonant in the last name
  let firstConsonant = '';
  
  for (let i = 0; i < lastName.length; i++) {
    const char = lastName[i];
    
    // Skip frontal vowels
    if (frontalVowels.includes(char)) {
      continue;
    }
    
    // Check if it's a Thai consonant (Thai consonants range: ก-ฮ)
    if (char >= 'ก' && char <= 'ฮ') {
      // Check if this is a high tone indicator followed by a sonorant
      if (highToneIndicators.includes(char) && i + 1 < lastName.length) {
        const nextChar = lastName[i + 1];
        // If the next character is a sonorant, skip this tone indicator
        if (sonorants.includes(nextChar)) {
          continue;
        }
      }
      
      firstConsonant = char;
      break;
    }
  }
  
  // If we found a consonant, create the shortened form
  if (firstConsonant) {
    return `${firstName} ${firstConsonant}.`;
  }
  
  // If unsuccessful, return only the first name
  return firstName;
}

/**
 * Post-processes an HTML file (such as, making it mobile-friendly).
 * @param {HtmlService.HtmlOutput} output An HTML output that will be processed.
 * @returns {HtmlService.HtmlOutput}
 */
function postProcessHtml(output) {
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return output;
}

/**
 * Renders HTML file without processing any additional layers
 * @param {string} filename File name that will be rendered.
 * @returns {HtmlService.HtmlOutput}
 */
function renderStaticPage(filename) {
  return postProcessHtml(HtmlService.createHtmlOutputFromFile(filename));
}

/**
 * Renders HTML file with all Google Apps Script preprocessors processed.
 * @param {string} filename File name that will be rendered.
 * @param {Record<string, any>} params All custom parameters.
 * @param {HtmlService.HtmlOutput}
 */
function renderTemplatePage(filename, params = {}) {
  const template = HtmlService.createTemplateFromFile(filename);
  for (const key of Object.keys(params)) {
    template[key] = params[key];
  }
  return postProcessHtml(template.evaluate());
}

/**
 * Temeplate engine that will be used with syntax below:
 * ```
 * <?!= include("HTMLNameWithoutDotHtml") ?>
 * ```
 * @param {string} filename Name of the HTML file inside the project, without '.html'.
 * @returns {string}
 */
function include(filename, params = {}) {
  return postProcessHtml(renderTemplatePage(filename, params)).getContent();
}

/**
 * Converts obtained date into JSON.
 * @param {string} date
 * @param {string} time
 */
function getDateFromDateTime(date, time) {
  const dates = date.split("-");
  if (dates.length != 3) {
    throw new Error("Invalid 'date' format. Expects 'yyyy-mm-dd' format, but got '"+ date +"'.");
  }
  const times = time.split(":");
  if (times.length != 2) {
    throw new Error("Invalid 'time' format. Expects 'xx:xx' format, but got '"+ time +"'.");
  }
  const padNumber = (str, len = 2) => {
    return String(Number(str)).padStart(len, "0");
  };
  return new Date(`${padNumber(dates[0], 4)}-${padNumber(dates[1])}-${padNumber(dates[2])}T${padNumber(times[0])}:${padNumber(times[1])}+07:00`);
}

/**
 * Formats a date object into Thai style: "date month year hour.minute น."
 * @param {Date} date - The date to format (defaults to current date/time if not provided)
 * @returns {string} The formatted date string in Thai format
 */
function formatThaiDate(date = new Date()) {
  // Thai month names
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Get date components
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  
  // Convert to Thai Buddhist Era (BE) which is CE + 543
  const year = date.getFullYear() + 543;
  
  // Get time components
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

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
function parseThaiDate(thaiDateString) {
  // Thai month names and their corresponding month index (0-based)
  const thaiMonths = {
    'มกราคม': 0,      // January
    'กุมภาพันธ์': 1,   // February
    'มีนาคม': 2,      // March
    'เมษายน': 3,      // April
    'พฤษภาคม': 4,     // May
    'มิถุนายน': 5,     // June
    'กรกฎาคม': 6,     // July
    'สิงหาคม': 7,     // August
    'กันยายน': 8,     // September
    'ตุลาคม': 9,      // October
    'พฤศจิกายน': 10,   // November
    'ธันวาคม': 11     // December
  };

  // Remove the "น." suffix and split the string by spaces
  const cleanString = thaiDateString.replace(' น.', '');
  const parts = cleanString.split(' ');

  if (parts.length !== 4) {
    throw new Error('Invalid Thai date format. Expected: "date month year hour.minute น."');
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
  const timeParts = parts[3].split('.');
  if (timeParts.length !== 2) {
    throw new Error('Invalid time format. Expected: "hour.minute"');
  }
  
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Create and return a new Date object
  const date = new Date(year, monthIndex, day, hours, minutes, 0);
  
  // Validate the parsed date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date components resulted in an invalid date');
  }

  return date;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function formCheckboxToBoolean(value) {
  return value === "on" ? true : false;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function fromGoogleSheetBoolean(value) {
  return value === "TRUE";
}

/**
 * @param {boolean} value
 * @returns {string}
 */
function toGoogleSheetBoolean(value) {
  return value ? "TRUE" : "FALSE";
}

/**
 * Gets a column index based on specified column name.
 * @param {string[]} c
 * @param {string} n
 * @returns {number}
 */
function col(c, n) {
  return c.indexOf(n);
}

/**
 * Create a column index getter
 * @param {string[]} row
 * @param {string[]} names
 */
function colGetter(row, names) {
  /**
   * @param {string} name
   */
  return (name) => row[col(names, name)];
}

/**
 * Create a column index getter
 * @param {string[]} row
 * @param {string[]} names
 */
function colSetter(row, names) {
  /**
   * @param {string} name
   * @param {string} value
   */
  return (name, value) => row[col(names, name)] = value;
}

/**
 * Create a column index commit function.
 * @param {SpreadsheetApp.Sheet} sheet
 * @param {string[]} row
 * @param {string[]} names
 * @param {number} i
 */
function colCommit(sheet, row, names, i) {
  return () =>  {
    sheet.getRange(i, 1, 1, names.length).setValues([ row ]);
  };
}

function sendEmail(params, data) {
  if (!data) {
    throw new Error("Incomplete parameters");
  }
  if (data.debug) {
    params.to = debugEmail;
    delete params.bcc;
    delete params.cc;
  }
  MailApp.sendEmail(params);
}

/**
 * Formats a date range into a Thai string following UTC+7 (Asia/Bangkok) standards.
 * If the dates fall on the same day, it displays the full date once followed by the time range.
 * If the dates fall on different days, it displays the full date and time for both points.
 * @param {Date} startDate - The beginning of the date range.
 * @param {Date} endDate - The end of the date range.
 * @returns {string} The formatted Thai date range string (e.g., "25 ธันวาคม 2568 09.00 น. – 18.00 น.").
 */
function formatThaiDateRange(date1, date2) {
  const optionsDate = { 
    timeZone: 'Asia/Bangkok', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  
  const optionsTime = { 
    timeZone: 'Asia/Bangkok', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  };

  // Helper to get formatted parts
  const getParts = (d) => {
    const dStr = d.toLocaleDateString('th-TH', optionsDate);
    const tStr = d.toLocaleTimeString('th-TH', optionsTime).replace(':', '.');
    return { fullDate: dStr, time: tStr };
  };

  const d1 = getParts(date1);
  const d2 = getParts(date2);

  // Compare dates using the Thai locale string (Day Month Year)
  const isSameDay = d1.fullDate === d2.fullDate;

  if (isSameDay) {
    return `${d1.fullDate} ${d1.time} น. – ${d2.time} น.`;
  } else {
    return `${d1.fullDate} ${d1.time} น. – ${d2.fullDate} ${d2.time} น.`;
  }
}

/**
 * Validates if a string matches a standard email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidEmail(email) {
    // A robust regular expression for standard email formats
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return emailRegex.test(email);
}
