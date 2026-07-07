function getDriverList() {
  const driversList = [];
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [ driversSheet, drivers ] = getSheet(spreadsheet, "Drivers");
  for (const [ getDriver ] of drivers()) {
    driversList.push({
      id: getDriver("DriverUid"),
      name: getDriver("DriverName"),
      email: getDriver("DriverEmail"),
    });
  }

  return driversList;
}

function post_driverList(data) {
  return { success: getDriverList(), noFlush: true };
}

function test_driverList() {
  Logger.log(post_driverList({}));
}
