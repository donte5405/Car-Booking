function post_carEdit(data) {
  let carId = data.id;
  const carName = data.name;
  const carMeter = data.mileage;
  const carLicenseId = data.licenseId;
  const isCarAmbulance = data.isAmbulance ? "✅" : "❌";

  if (!carName || !carMeter || !carLicenseId) {
    Logger.log("Insufficient parameters.");
    return requestInvalid;
  }

  if (!carId) {
    carId = Utilities.getUuid();
  }

  let convertedMeter = Number(String(carMeter));
  if (isNaN(convertedMeter)) {
    Logger.log("Invalid mileage number.");
    return requestInvalid;
  }

  let writeMode;
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [ getCar, setCar, commitCar ] = queryCar(spreadsheet, carId);
  if (!getCar) {
    const [ sheet ] = getSheet(spreadsheet, "Cars");
    writeMode = "new";
    sheet.appendRow([
      carId, // CarUid
      carLicenseId, // CarLicenseId
      carName, // CarName
      carMeter, // CarMeter
      isCarAmbulance, // IsCarAmbulance
    ]);
  } else {
    writeMode = "edit";
    setCar("CarName", carName);
    setCar("CarMeter", convertedMeter);
    setCar("CarLicenseId", carLicenseId);
    setCar("IsCarAmbulance", isCarAmbulance);
    commitCar();
  }
  
  return { success: writeMode };
}

function test_carEdit() {
  Logger.log(post_carEdit({
    debug: true,
    id: "8bcb15d9-6e43-420d-b1a0-6ea185f0fd41",
    name: "Mitsubishi Triton 2020 สีทอง",
    mileage: "10",
    licenseId: "กข 3810 มุกดาหาร",
  }));
}
