function post_carList(data) {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const availableCars = [];
  const unavailableCars = [];
  const currentTime = new Date().getTime();
  const [carsSheet, cars] = getSheet(spreadsheet, "Cars");
  const [ requestsSheet, requests ] = getSheet(spreadsheet, "Requests");
  for (const [getCar, setCar, commitCar] of cars()) {
    const isAmbulance = getCar("IsCarAmbulance") === "✅";
    const carInfo = {
      id: getCar("CarUid"),
      name: getCar("CarName"),
      mileage: getCar("CarMeter"),
      licenseId: getCar("CarLicenseId"),
      isAmbulance,
    };
    const isCarBeingUsed = () => {
      for (const [getRequest, setRequest, commitRequest] of requests()) {
        if (getCar("CarUid") === getRequest("CarUid")) {
          const fromDate = parseThaiDate(getRequest("RequestFrom")).getTime();
          const toDate = parseThaiDate(getRequest("RequestTo")).getTime();
          if (currentTime >= fromDate && currentTime <= toDate) {
            return true;
          }
        }
      }
      return false;
    };
    if (isCarBeingUsed()) {
      unavailableCars.push(carInfo);
    } else {
      availableCars.push(carInfo);
    }
  }
  return {
    success:{
      available: availableCars,
      unavailable: unavailableCars,
    }
  };
}

function test_carList() {
  Logger.log(post_carList({
    debug: true,
    id: "0e2e7e15-85c3-4eaf-b89a-362fd6ddf965",
  }));
}
