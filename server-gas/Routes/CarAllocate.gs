function post_carAllocate(data) {
  const id = data.id;
  if (!id) {
    return { error: "คำร้องขอไม่ถูกต้อง (1)" };
  }

  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [getRequest, setRequest, commitRequest, requestsSheet, requests] = queryRequest(spreadsheet, id);
  if (!getRequest) {
    Logger.log("Request UID not found.");
    return requestInvalid;
  }
  if (getRequest("IsRequestApproved") === "❌") {
    Logger.log("Request not approved.");
    return requestInvalid;
  }

  let requestFrom = getRequest("RequestFrom");
  let newFromDate;
  try {
    const newFrom = data.from;
    if (newFrom) {
      newFromDate = parseThaiDate(newFrom).getTime();
      if (newFrom != requestFrom) {
        setRequest("RequestFrom", newFrom);
        requestFrom = newFrom;
      }
    }
  } catch {
    return { error: "รูปแบบเวลาที่เริ่มใช้รถไม่ถูกต้อง ต้องอยู่ในฟอร์แมต '[วัน] [ชื่อเดือนเต็ม] [ปี พ.ศ.] [ชั่วโมง].[นาที] น.' เช่น '1 มกราคม 2513 00.00 น.' โดยห้ามมีเว้นวรรคเกินใด ๆ" };
  }

  let requestTo = getRequest("RequestTo");
  let newToDate;
  try {
    const newTo = data.to;
    if (newTo) {
      newToDate = parseThaiDate(newTo).getTime();
      if (newTo != requestTo) {
        setRequest("RequestTo", newTo);
        requestTo = newTo;
      }
    }
  } catch {
    return { error: "รูปแบบเวลาที่สิ้นสุดใช้รถไม่ถูกต้อง ต้องอยู่ในฟอร์แมต '[วัน] [ชื่อเดือนเต็ม] [ปี พ.ศ.] [ชั่วโมง].[นาที] น.' เช่น '1 มกราคม 2513 00.00 น.' โดยห้ามมีเว้นวรรคเกินใด ๆ" };
  }

  if (typeof newFromDate === "number" && typeof newToDate === "number") {
    if (newToDate < newFromDate) {
      return { error: "เวลาที่สิ้นสุดการใช้รถ ห้ามน้อยกว่ากว่าที่เริ่มใช้รถ" };
    }

    if (newToDate == newFromDate) {
      return { error: "เวลาที่เริ่มใช้รถ ห้ามเท่ากับเวลาที่สิ้นสุดการใช้รถ" };
    }

    const timeDiff = Math.abs(newToDate - newFromDate);

    if (timeDiff < 1800000) {
      return { error: "เวลาที่ใช้รถขั้นต่ำต้องไม่ต่ำกว่า 30 นาที" };
    }

    if (timeDiff > 2629746000) {
      return { error: "เวลาที่ใช้รถห้ามเกิน 1 เดือน" };
    }
  }

  if (data.cancel) {
    // Porter cancels the request
    // Alert requester and porter's HoD
    const allocatorReasons = data.reasons;
    const [allocatorName, porterHodName, porterHodEmail] = getConfig("PorterName", "HodName", "HodEmail");
    const requesterName = getRequest("RequesterName");
    const requesterEmail = getRequest("RequesterEmail");
    const requestReasons = getRequest("RequestReasons");
    const requestParticipantNames = getRequest("RequestParticipantNames");

    for (const [name, email] of [
      [porterHodName, porterHodEmail],
      [requesterName, requesterEmail],
    ]) {
      const emailBody = renderTemplatePage("Mails/AllocatorCancelRequest", {
        allocatorName,
        allocatorReasons,
        recipientName: name,
        requesterName,
        requestParticipantNames,
        requestReasons,
        requestFrom,
        requestTo,
      }).getContent();
      sendEmail({
        to: email,
        subject: "[Car Booking] " + allocatorName + " ยกเลิกคำขอจาก " + requesterName,
        htmlBody: emailBody,
      }, data);
    }

    setRequest("IsRequestApproved", "❌");
    setRequest("CarAllocatorReasons", allocatorReasons);
    commitRequest();
    return { success: "cancel-allocate" };
  }

  const carUid = data.carId;
  const [getCar, setCar, commitCar] = queryCar(spreadsheet, carUid);

  if (!getCar) {
    Logger.log("Car UID not found.");
    return requestInvalid;
  }

  const nRequestFrom = parseThaiDate(requestFrom);
  const nRequestTo = parseThaiDate(requestTo);
  const getAnotherRequest = getOverlapRequest(requests, nRequestFrom, nRequestTo, carUid, getRequest("RequestUid"));
  if (getAnotherRequest) {
    return { error: "เวลาจัดสรร ทับกับคำร้องขอจาก " + getAnotherRequest("RequesterName") + " ที่ขอไว้ตั้งแต่  " + requestFrom + " ถึง " + requestTo };
  }

  let statusToWrite = "";
  const driverName = data.driver;
  const allocatorName = data.allocator;

  if (getRequest("SplitFromRequestId")) {
    statusToWrite = "↪️"
  } else if (driverName && allocatorName) {
    statusToWrite = "✅";
  } else if (driverName || allocatorName) {
    statusToWrite = "⏳";
  } else {
    statusToWrite = "❌";
  }

                  // const mileageStart = String(data.mileageStart || "");
                  // const mileageEnd = String(data.mileageEnd || "");

                  // let mileageToWrite;
                  
                  // if (Number(mileageEnd)) {
                  //   mileageToWrite = mileageEnd;
                  //   statusToWrite = "✅";
                  // } else if (mileageStart) {
                  //   mileageToWrite = mileageStart;
                  //   statusToWrite = "⏳";
                  // } else {
                  //   statusToWrite = "❌";
                  // }

                  // if (mileageToWrite) {
                  //   if (Number(getCar("CarMeter")) > Number(mileageToWrite)) {
                  //     Logger.log("Mileage can't be lower than saved value.");
                  //     return { error: "เลขไมล์ไม่สามารถมีค่าต่ำกว่าที่บันทึกไว้ได้" };
                  //   }
                  //   setCar("CarMeter", mileageToWrite);
                  //   commitCar();
                  // }

                  // if (statusToWrite === "⏳") {
  
  // Alert requester and porter's HoD
  const carName = getCar("CarName");
  const carLicenseId = getCar("CarLicenseId");
  const [
    porterCalendarApiToken,
    porterCalendarApiUrl,
    porterHodName,
    porterHodEmail,
    porterLocation,
  ] = getConfig(
    "PorterCalendarApiToken",
    "PorterCalendarApiUrl",
    "HodName",
    "HodEmail",
    "PorterLocation",
  );
  const requesterName = getRequest("RequesterName");
  const requesterEmail = getRequest("RequesterEmail");
  const requestReasons = getRequest("RequestReasons");
  const requestParticipantNames = getRequest("RequestParticipantNames");

  for (const [name, email] of [
    [porterHodName, porterHodEmail],
    [requesterName, requesterEmail],
  ]) {
    const emailBody = renderTemplatePage("Mails/Allocated", {
      recipientName: name,
      carName,
      carLicenseId,
      requesterName,
      requestParticipantNames,
      requestReasons,
      requestFrom,
      requestTo,
    }).getContent();
    sendEmail({
      to: email,
      subject: "[Car Booking] มีการจัดสรรรถยนต์ส่วนกลาง " + carName + " ให้กับ " + requesterName,
      htmlBody: emailBody,
    }, data);
  }
  
                  // }

  setRequest("CarUid", carUid);
  setRequest("CarDriverName", driverName);
  setRequest("CarAllocatorName", allocatorName);
                  // setRequest("CarMeterStart", mileageStart);
                  // setRequest("CarMeterEnd", mileageEnd);
  setRequest("IsRequestCompleted", statusToWrite);
  commitRequest();

  // Alert Everyone via Notifier API
  const emails = [];
  emails.push(
    getRequest("RequesterEmail"),
    //                getRequest("ApproverEmail"),
    porterHodEmail,
  );
  const drivers = getDriverList();
  for (const driver of drivers) {
    emails.push(driver.email);
  }

  // Send calendar
  const calendarTitle = (getCar("IsCarAmbulance") === "✅" ? "🚑" : "🛻") + getRequest("RequestReasons");
  const res = UrlFetchApp.fetch(porterCalendarApiUrl, {
    method: "post",
    contentType: "text/plain;charset=utf-8",
    payload: JSON.stringify({
      token: porterCalendarApiToken,
      title: calendarTitle,
      start: nRequestFrom.getTime(),
      end: nRequestTo.getTime(),
      location: porterLocation, 
      emails: emails,
    }),
  });
  try {
    const response = JSON.parse(res.getContentText());
    if (response.success) {
      return { success: "allocate" };
    } else {
      return { error: "calendar-fail: " + JSON.stringify(response.error) };
    }
  } catch (e) {
    return { error: "calendar-error" };
  }
}

function test_carAllocate() {
  Logger.log(post_carAllocate({
    debug: true,
    id: "e8322df7-a016-432e-880c-f582eb755adb",
    carId: "d08cc5a8-be46-46d7-add0-c3e31f79f701",
    driver: "พลขับทดสอบ ทดสอบ",
    allocator: "แผนกเคลื่อนย้ายผู้ป่วย",
    from: "24 กรกฎาคม 2568 22.00 น.",
    to: "24 กรกฎาคม 2568 23.00 น.",
  }));
}

function test_carAllocate_cancel() {
  Logger.log(post_carAllocate({
    debug: true,
    id: "7488ccb9-7654-48e3-9f61-4eb3ac20aae8",
    cancel: true,
    reasons: "รถยนต์ถูกจองไปก่อนหน้านี้แล้ว",
  }));
}
