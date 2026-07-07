function post_carRequest(data) {
  const approverToken = Utilities.getUuid();
  const requestUid = Utilities.getUuid(); // RequestUid
  const requesterName = data.requesterName;
  const requesterEmail = data.requesterEmail;
  const requesterDepartment = data.requesterDepartment;
  const requestReasons = data.requestReasons;
  const isRequestUrgent = data.isRequestUrgent;
  const isRequestRush = data.isRequestRush;
  const requestParticipantNames = data.requesterParticipants;
  const requestFromDate = data.requestFromDate;
  const requestFromTime = data.requestFromTime;
  const requestToDate = data.requestToDate;
  const requestToTime = data.requestToTime;
  const requestFrom = getDateFromDateTime(requestFromDate, requestFromTime);
  const requestTo = getDateFromDateTime(requestToDate, requestToTime);
  const requestCar = data.requestCar || "";

  const requestAmbulanceComment = data.requestAmbulanceComment || "";
  const altApproverReasons = data.altApproverReasons || "";
  let approver = data.approver || "hod";

  const currentTime = new Date().getTime();
  const requestFromMs = requestFrom.getTime();
  const requestToMs = requestTo.getTime();

  if (!isValidEmail(requesterEmail)) {
    return { error: "รูปแบบอีเมลผิด (ต้องการในลักษณะ name@domain.com, ที่กรอกข้อมูลคือ \"" + requesterEmail + "\")" };
  }

  if (requestFromMs < currentTime || requestToMs < currentTime) {
    return { error: "ไม่อนุญาตให้คีย์ขอใช้งานรถส่วนกลางย้อนหลัง" };
  }

  if (!requestCar) {
    return { error: "ยังไม่ได้เลือกรถ" };
  }

  if (requestToMs < requestFromMs) {
    return { error: "เวลาสิ้นสุดการใช้งานรถ ห้ามน้อยกว่าเวลาเริ่มใช้รถ" };
  }

  if (requestToMs == requestFromMs) {
    return { error: "เวลาสิ้นสุดการใช้งานรถ ห้ามเท่ากับเวลาเริ่มใช้รถ เนื่องจากไม่สามารถขับรถแบบวิ่งทำเวลาภายในเวลา 0 วินาทีได้" };
  }

  const requestTimeDiffMs = Math.abs(requestToMs - requestFromMs);

  if (requestTimeDiffMs < 1800000) {
    return { error: "ไม่อนุญาตให้ขอใช้รถในระยะเวลาต่ำกว่า 30 นาที" }
  }

  if (requestTimeDiffMs > 2629746000) {
    return { error: "เวลาที่ใช้รถห้ามเกิน 1 เดือน" };
  }

  if (approver != "hod" && !altApproverReasons.trim()) {
    return { error: "หากท่านเลือกผู้อนุมัติเป็นผู้ที่ไม่ใช่ผู้บังคับบัญชาของท่าน ต้องระบุเหตุผลด้วยว่าเหตุใดจึงไม่สามารถให้ผู้บังคับบัญชาอนุมัติได้" };
  }

  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [ getCar ] = queryCar(spreadsheet, requestCar);
  if (!getCar) {
    return { error: "รถที่เลือกไม่ถูกต้อง" };
  }

  const [sheet, requests] = getSheet(spreadsheet, "Requests");
  const getAnotherRequest = getOverlapRequest(requests, requestFrom, requestTo, requestCar); // Check if there's overlapping request
  if (getAnotherRequest) {
    return { error: "เวลาที่ท่านจองรถ ซ้อนทับกับเวลาจองรถของ " + getAnotherRequest("RequesterDepartment") + " ตั้งแต่เวลา " + getAnotherRequest("RequestFrom") + " ถึง " + getAnotherRequest("RequestTo") };
  }

  let recipients = [];
  const subject = `[Car Booking] คำขออนุญาตใช้รถยนต์ส่วนกลาง${isRequestRush ? " \"วิ่งทำเวลา\"" : ""} สำหรับ ${requesterName}`;
  const approveUrl = `${getFrontendUrl(data.debug)}/approve/?id=${requestUid}&token=${approverToken}`;
  const rejectUrl = `${getFrontendUrl(data.debug)}/reject/?id=${requestUid}&token=${approverToken}`;
  const viewAllocateUrl = `${getFrontendUrl(data.debug)}/allocate/?id=${requestUid}&token=${approverToken}&mode=view`;

  if (isRequestRush) {
    // Force to supervisor if it's rush request.
    approver = "sup"; 
  } else {
    // Send Email to HoD, no matter what
    const [getHod] = queryHod(spreadsheet, requesterDepartment);
    if (!getHod) {
      if (approver === "hod") {
        Logger.log("Request has invalid department code.");
        return { error: "แผนกที่ร้องขอไม่ถูกต้อง" };
      }
    } else {
      recipients.push({
        name: getHod("HodName"),
        email: getHod("Email"),
        isHod: true,
      });
    }
  }

  switch (approver) {
    case "porter": {
      const [ porterHodName, porterHodEmail ] = getConfig("HodName", "HodEmail");
      recipients.push({
        name: porterHodName,
        email: porterHodEmail,
        isHod: false,
      });
    } break;
    case "sup": {
      const [supSheet, sups] = getSheet(spreadsheet, "Sup");
      for (const [getSup] of sups()) {
        recipients.push({
          name: getSup("Name"),
          email: getSup("Email"),
          isHod: false,
        });
      }
    } break;
  }

  // Debug.
  // return { "success": "success" };

  for (const { name, email, isHod } of recipients) {
    const htmlBody = renderTemplatePage("Mails/ApproveRequest", {
      hodName: name,
      approver,
      requesterName,
      requesterDepartment,
      requesterEmail,
      isRequestUrgent,
      isRequestRush,
      requestReasons,
      requestParticipantNames,
      altApproverReasons: (isHod ? undefined : altApproverReasons),
      approveUrl: approveUrl + "&email=" + email,
      rejectUrl: rejectUrl + "&email=" + email,
      viewAllocateUrl,
    }).getContent();

    sendEmail({
      to: email,
      subject,
      htmlBody,
    }, data);
  }

  sheet.appendRow([
    requestUid, // RequestUid
    formatThaiDate(), // RequestTime (now)
    requesterName, // RequesterName
    requesterDepartment, // RequesterDepartment
    requesterEmail, // RequesterEmail
    requestReasons, // RequestReasons
    isRequestUrgent, // IsRequestUrgent
    isRequestRush, // IsRequestRush
    requestParticipantNames, // RequestParticipantNames0
    formatThaiDate(requestFrom), // RequestFrom
    formatThaiDate(requestTo), // RequestTo
    "⏳", // IsRequestApproved
    approverToken, // ApproverToken
    "", // ApproverEmail
    "", // ApproverReasons
    requestCar, // CarUid
    "", // CarDriverName
    "", // CarMeterStart
    "", // CarMeterEnd
    "", // CarAllocatorName
    "", // CarAllocatorReasons
    "❌", // IsRequestCompleted
    requestAmbulanceComment, // RequestAmbulanceComment
    altApproverReasons, // AltApproverReasons
    "", // SplitFromRequestId
  ]);

  return { success: "request completed" };
}

function test_carRequest() {
  Logger.log(post_carRequest({
    debug: true,
    requesterName: "Test",
    requesterEmail: "test",
    requesterDepartment: "TST - แผนกทดสอบ",
    requestReasons: "ต้องใช้รถ",
    isRequestUrgent: true,
    isRequestRush: false,
    requestParticipantNames: "Another person",
    requestFromDate: "2025-07-23",
    requestFromTime: "22:10",
    requestToDate: "2025-07-23",
    requestToTime: "22:40",
    requestCar: "d08cc5a8-be46-46d7-add0-c3e31f79f701",
    requestAmbulanceComment: "",
    approver: "sup",
    altApproverReasons: "",
  }));
}
