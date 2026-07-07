const requestInvalid = { error: "request-invalid" };

function routerPost(e) {
  const data = e;
  const method = data.method;

  if (!method) {
    return requestInvalid;
  }

  switch (method) {
    case "auth": return post_auth(data);
    case "approve": return post_carApprove(data);
    case "cars": return post_carList(data);
    case "reject": return post_carReject(data);
    case "request": return post_carRequest(data);
    case "schedule": return post_scheduleList(data);

    case "allocate": return authenticate(data, post_carAllocate);
    // case "cars": return authenticate(data, post_carList); // No longer requires authentication, for requesters
    case "car": return authenticate(data, post_carEdit);
    case "driver": return authenticate(data, post_driverEdit);
    case "drivers": return authenticate(data, post_driverList);
    case "report-totaldepartment": return authenticate(data, post_report_totalDepartment);
    case "requests": return authenticate(data, post_requestsList);
    case "requestdata": return authenticate(data, post_requestData);
  }

  return requestInvalid;
}

function doPost(e) {
  // Grab user input safely
  e = e.postData.contents;
  const raw = e;
  if (typeof e !== "string") {
    return requestInvalid;
  }
  try {
    e = JSON.parse(e);
  } catch (e) {
    return requestInvalid;
  }
  if (typeof e !== "object") {
    return requestInvalid;
  }
  
  try {
    const res = routerPost(e);
    if (!res.noFlush) {
      SpreadsheetApp.flush();
    }
    return ContentService.createTextOutput(JSON.stringify(res));
  } catch (err) {
    // Detects spreadsheet stopped working exception
    if (err.message.includes(sheetId)) {
      return ContentService.createTextOutput(JSON.stringify({ error: "ระบบทำงานหนัก โปรดคลิกปุ่มเดิมอีกครั้ง" }));
    }
    const errMsg = raw + " <br><br>" +
        "---stack--- <br>" + err.stack + " <br><br>" +
        "---name--- <br>" + err.name + " <br><br>" +
        "---message--- <br>" + err.message + " <br><br>"
    Logger.log(errMsg);
    MailApp.sendEmail({
      to: adminEmailAddress,
      cc: itHodEmailAddress,
      subject: "[Car Booking] ข้อผิดพลาดร้ายแรง",
      htmlBody: errMsg,
    });
    return ContentService.createTextOutput(JSON.stringify({ error: "เกิดข้อผิดพลาดของระบบอย่างรุนแรง ขณะนี้ระบบได้ส่ง Log ไปยังแผนก IT เรียบร้อยแล้ว ขออภัยในความไม่สะดวก" }));
  }
}
