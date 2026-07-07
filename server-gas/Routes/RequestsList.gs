function getRequestJson(getRequest, cars) {
  let carName = "-";
  const carUid = getRequest("CarUid");
  if (carUid) {
    for (const [getCar] of cars()) {
      if (getCar("CarUid") === carUid) {
        carName = getCar("CarName") + " (" + getCar("CarLicenseId") + ")";
      }
    }
  }

  return {
    id: getRequest("RequestUid"),
    time: getRequest("RequestTime"),
    name: shortenThaiName(getRequest("RequesterName")),
    department: getRequest("RequesterDepartment"),
    email: getRequest("RequesterEmail"),
    reasons: getRequest("RequestReasons"),
    urgent: getRequest("IsRequestUrgent") == "TRUE" ? true : false,
    rush: getRequest("IsRequestRush") == "TRUE" ? true : false,
    participants: getRequest("RequestParticipantNames"),
    from: getRequest("RequestFrom"),
    to: getRequest("RequestTo"),
    approved: getRequest("IsRequestApproved"),
    reject: getRequest("ApproverReasons"),
    car: getRequest("CarUid"),
    carName: carName,
    driver: getRequest("CarDriverName"),
    mileageStart: getRequest("CarMeterStart"),
    mileageEnd: getRequest("CarMeterEnd"),
    allocator: getRequest("CarAllocatorName"),
    isCompleted: getRequest("IsRequestCompleted"),
    requestAmbulanceComment: getRequest("RequestAmbulanceComment"),
  };
}

function post_requestsList(data) {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet หน่วง/ไม่ถูกรีเฟรช จะกลับมา Update รายการคำขออีกครั้งใน 15 วินาที"};
  }

  const  list = [];
  const [sheet, requests] = getSheet(spreadsheet, "Requests");
  const [carSheet, cars] = getSheet(spreadsheet, "Cars");
  for (const [getRequest] of requests()) {
    list.push(getRequestJson(getRequest, cars));
  }

  // Sort with the most recent "RequestTo" significance
  list.sort((a, b) => parseThaiDate(a.to).getTime() > parseThaiDate(b.to).getTime() ? -1 : 1);

  return { success: list, noFlush: true };
}

function post_requestData(data) {
  const requestUid = data.id;

  if (!requestUid) {
    return requestInvalid;
  }

  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [sheet, requests] = getSheet(spreadsheet, "Requests");
  for (const [getRequest] of requests()) {
    const id = getRequest("RequestUid");
    if (id === requestUid) {
      return { success: getRequestJson(getRequest, cars) };
    }
  }

  Logger.log("Request UID not exist.");
  return requestInvalid;
}

function test_requestList() {
  Logger.log(post_requestsList());
}

function test_requestData() {
  Logger.log(post_requestData({
    debug: true,
    id: "debe6e19-a824-4fef-8170-cb46bede58a4",
  }));
}
