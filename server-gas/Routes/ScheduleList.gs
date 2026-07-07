function post_scheduleList(data) {
  const carNames = {};
  const routines = {};
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [carSheet, cars] = getSheet(spreadsheet, "Cars");
  const [requestSheet, requests] = getSheet(spreadsheet, "Requests");
  const currentDate = new Date().getTime();
  for (const [getRequest] of requests()) {
    const toDate = parseThaiDate(getRequest("RequestTo")).getTime(); // Points to the last date
    if (currentDate - toDate > 86400000) {
      continue; // Ignore past/already completed requests
    }
    const carUid = getRequest("CarUid");
    if (carUid) {
      if (!carNames[carUid]) {
        for (const [getCar] of cars()) {
          if (getCar("CarUid") === carUid) {
            carNames[carUid] = getCar("CarName"); //+ " – " + getCar("CarLicenseId");
            break;
          }
        }
      }
    }
    const carFullName = carNames[carUid] || "ยังไม่มีการจัดสรรรถ";
    if (!routines[carFullName]) {
      routines[carFullName] = {};
    }
    const routine = routines[carFullName];
    const fromDate = parseThaiDate(getRequest("RequestFrom"));
    const requester = getRequest("RequesterDepartment").split(" - ")[1];
    const processedDate = formatThaiDateRange(fromDate, parseThaiDate(getRequest("RequestTo")));
    routine[fromDate.getTime()] = getRequest("IsRequestApproved") + " (" + processedDate + ")" + " " + requester;
  }
  for (const carFullName in routines) {
    const routine = routines[carFullName];
    const array = [];
    for (const date of Object.keys(routine).sort()) {
      array.push(routine[date]);
    }
    routines[carFullName] = array;
  }
  return { success: routines, noFlush: true };
}

function test_scheduleList() {
  Logger.log(post_scheduleList({
    debug: true,
  }));
}
