/**
 * Get config value from specified keys.
 * @param {...string} keys
 */
function getConfig(...keys) {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return null;
  }

  const sheet = spreadsheet.getSheetByName("Config").getDataRange().getValues();
  const results = [];

  for (const key of keys) {
    for (let i = 1; i < sheet.length; i++) {
      if (sheet[i][0] === key) {
        results.push(sheet[i][1]);
        break;
      }
    }
  }

  return results;
}

/**
 * Set config value to specified keys.
 * @param {Record<string, string>} config
 */
function setConfig(config) {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return null;
  }

  const sheet = spreadsheet.getSheetByName("Config");
  const values = sheet.getDataRange().getValues();
  const c = values.shift();
  for (const key in config) {
    let i = 2;
    let selectedRow;
    for (const row of values) {
      if (row[col(c, "Key")] === key) {
        selectedRow = row;
        break;
      }
      i++;
    }
    if (!selectedRow) {
      throw new Error("Request key not found.");
    }
    selectedRow[col(c, "Value")] = config[key];
    sheet.getRange(i, 1, 1, c.length).setValues([ selectedRow ]);
  }
}

/**
 * Prepare a spreadsheet for use.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet
 * @param {string} sheetName
 */
function getSheet(spreadsheet, sheetName) {
  const getFunc = () => {
    const sheet = spreadsheet.getSheetByName(sheetName);
    const rows = sheet.getDataRange().getValues();
    const names = rows.shift();
    const iterator = function* () {
      let i = 2;
      for (const row of rows) {
        yield [
          colGetter(row, names),
          colSetter(row,names),
          colCommit(sheet, row, names, i),
          i
        ];
        i ++;
      }
      return i;
    };
    return [ sheet, iterator ];
  };

  let finished = false;
  let result;
  while (!finished) {
    try {
      result = getFunc();
      finished = true;
    } catch (e) {
      if (e.message.includes("มีการส่งคำขอพร้อมกันมากเกินไป")) {
        Utilities.sleep(1000);
      } else {
        throw e;
      }
    }
  }
  return result;
}

/**
 * Get a request from sheet database.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet;
 * @param {string} requestUid
 */
function queryRequest(spreadsheet, requestUid) {
  const [ sheet, iterator ] = getSheet(spreadsheet, "Requests");

  let getter = null;
  let setter = null;
  let commit = null;
  for (const [ getRequest, setRequest, commitRequest ] of iterator()) {
    if (getRequest("RequestUid") === requestUid) {
      getter = getRequest;
      setter = setRequest;
      commit = commitRequest;
      break;
    }
  }
  return [ getter, setter, commit, sheet, iterator ];
}

/**
 * Get a car from sheet database.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet;
 * @param {string} carUid
 */
function queryCar(spreadsheet, carUid) {
  const [ sheet, iterator ] = getSheet(spreadsheet, "Cars");

  let getter = null;
  let setter = null;
  let commit = null;
  for (const [ getCar, setCar, commitCar ] of iterator()) {
    if (getCar("CarUid") === carUid) {
      getter = getCar;
      setter = setCar;
      commit = commitCar;
      break;
    }
  }
  return [ getter, setter, commit, sheet, iterator ];
}

/**
 * Get an HoD from sheet database.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet;
 * @param {string} name
 */
function queryHod(spreadsheet, name) {
  const [ sheet, iterator ] = getSheet(spreadsheet, "Hod");

  let getter = null;
  let setter = null;
  let commit = null;
  for (const [ getHod, setHod, commitHod ] of iterator()) {
    if (getHod("Name") === name || getHod("Email") === name || getHod("HodName") === name) {
      getter = getHod;
      setter = setHod;
      commit = commitHod;
      break;
    }
  }
  return [ getter, setter, commit, sheet, iterator ];
}

/**
 * Get a driver from sheet database.
 * @param {SpreadsheetApp.Spreadsheet} spreadsheet;
 * @param {string} driverUid
 */
function queryDriver(spreadsheet, driverUid) {
  const [ sheet, iterator ] = getSheet(spreadsheet, "Drivers");

  let getter = null;
  let setter = null;
  let commit = null;
  for (const [ getDriver, setDriver, commitCar ] of iterator()) {
    if (getDriver("DriverUid") === driverUid) {
      getter = getDriver;
      setter = setDriver;
      commit = commitCar;
      break;
    }
  }
  return [ getter, setter, commit, sheet, iterator ];
}

/**
 * @param {Date} requestFrom
 * @param {Date} requestTo
 * @param {string} requestCar
 * @param {string} requestUid
 */
function getOverlapRequest(requests, requestFrom, requestTo, requestCar = "", requestUid = "") {
  // Check time overlap.
  for (const [getRequest] of requests()) {
    if (getRequest("IsRequestApproved") === "❌") {
      continue;
    }
    if (requestUid) {
      if (getRequest("RequestUid") === requestUid) {
        continue; // Ignore self
      }
    }
    if (requestCar) { // If car is specified
      if (getRequest("CarUid") !== requestCar) {
        continue; // Ignore other cars
      }
    }
    const anotherFromfromStr = getRequest("RequestFrom");
    const anotherToStr = getRequest("RequestTo");
    const anotherFrom = parseThaiDate(anotherFromfromStr);
    const anotherTo = parseThaiDate(anotherToStr);
    if (isOverlapped(
      requestFrom.getTime(),
      requestTo.getTime(),
      anotherFrom.getTime(),
      anotherTo.getTime()
    )) {
      return getRequest;
    }
  }
  
  return null;
}
