const rRequestTo = 10;

function archiveOldRequests() {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return;
  }

  const dataSheet = spreadsheet.getSheetByName("Requests");
  const archiveSheet = spreadsheet.getSheetByName("ArchivedRequests");
  const current = new Date().getTime();
  let oldRequestsFound = true;
  while (oldRequestsFound) {
    const range = dataSheet.getRange(2, 1, 1, 24);
    const values = range.getValues()[0];
    Logger.log(values);
    const requestTo = parseThaiDate(values[rRequestTo]).getTime();
    if (current - requestTo > 604800000) {
      try {
        dataSheet.deleteRow(2);
      } catch {
        range.clear();
        oldRequestsFound = false;
      }
      archiveSheet.appendRow(values);
      SpreadsheetApp.flush();
    } else {
      oldRequestsFound = false;
    }
  }
}
