function post_driverEdit(data) {
  let driverUid = data.id;
  const driverName = data.name;
  const driverEmail = data.email;

  if (!driverName || !driverEmail) {
    Logger.log("Insufficient data fields.");
    return requestInvalid;
  }

  if (!driverUid) {
    driverUid = Utilities.getUuid();
  }

  let writeMode;
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [ getDriver, setDriver, commitDriver ] = queryDriver(spreadsheet, driverUid)
  if (!getDriver) {
    const [ sheet ] = getSheet(spreadsheet, "Drivers");
    writeMode = "new";
    sheet.appendRow([
      driverUid, // DriverUid
      driverName, // DriverName
      driverEmail, // DriverEmail
    ]);
  } else {
    writeMode = "edit";
    setDriver("DriverUid", driverUid);
    setDriver("DriverName", driverName);
    setDriver("DriverEmail", driverEmail);
    commitDriver();
  }

  return { success: writeMode };
}

function test_driverEdit() {
  Logger.log(post_driverEdit({
    debug: true,
    id: "789cebd3-6fc5-4d8c-bda0-23a97760129e",
    name: "ทดสอบ ทดสอบ",
    email: debugEmail,
  }));
}
