function post_carApprove(data) {
  const requestUid = data.id;
  const approverToken = data.token;
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [getRequest, setRequest, commitRequest] = queryRequest(spreadsheet, requestUid);
  if (!getRequest) {
    Logger.log("Request UID not found.");
    return requestInvalid;
  }

  if (getRequest("ApproverToken") !== approverToken) {
    Logger.log("Approver token invalid.");
    return requestInvalid;
  }

  if (getRequest("IsRequestApproved") !== "⏳") {
    Logger.log("Can't approve the already-modified request.");
    return { error: "คำขออนุมัตินี้ได้รับการอนุมัติไปก่อนหน้านี้แล้วโดย Email: " + getRequest("ApproverEmail") };
  }

  const [getHod] = queryHod(spreadsheet, data.email || getRequest("RequesterDepartment")); // Either specified approver email or department code
  if (!getHod) {
    Logger.log("Request has invalid department code or email.");
    return requestInvalid;
  }
  
  const hodName = getHod("HodName");
  const [
    allocatorEmail,
    allocatorName,
    porterHodName,
    porterHodEmail
  ] = getConfig(
    "PorterEmail",
    "PorterName",
    "HodName",
    "HodEmail"
  );
  const requestApprovedEmailBody = renderTemplatePage("Mails/RequestApproved", {
    hodName: hodName,
    requesterName: getRequest("RequesterName"),
    requestReasons: getRequest("RequestReasons"),
  }).getContent();
  
  sendEmail({
    to: getRequest("RequesterEmail"),
    subject: "[Car Booking] คำขออนุญาตใช้รถส่วนกลางของคุณ ได้รับการอนุมัติ",
    htmlBody: requestApprovedEmailBody,
  }, data);

  for (const [name, email] of [
    [allocatorName, allocatorEmail],
    [porterHodName, porterHodEmail],
  ]) {
    const emailBody = renderTemplatePage("Mails/AllocateRequest", {
      allocatorName: name,
      requesterName: getRequest("RequesterName"),
      requestReasons: getRequest("RequestReasons"),
      isRequestUrgent: fromGoogleSheetBoolean(getRequest("IsRequestUrgent")),
      isRequestRush: fromGoogleSheetBoolean(getRequest("IsRequestRush")),
      requestParticipantNames: getRequest("RequestParticipantNames"),
      requestFrom: getRequest("RequestFrom"),
      requestTo: getRequest("RequestTo"),
      allocateButton: name == allocatorName,
      allocateUrl: `${getFrontendUrl(data.debug)}/auth/?id=${requestUid}`,
    }).getContent();
    sendEmail({
      to: email,
      subject: "[Car Booking] มีคำขอใช้รถยนต์ส่วนกลางใหม่",
      htmlBody: emailBody,
    }, data);
  }
  
  setRequest("ApproverEmail", getHod("Email"));
  setRequest("IsRequestApproved", "✅");
  commitRequest();

  return { success: "approve" };
}

function test_carApprove() {
  Logger.log(post_carApprove({
    debug: true,
    email: adminEmailAddress,
    id: "e8322df7-a016-432e-880c-f582eb755adb",
    token: "43f18624-1c6b-48a9-bd11-277bf4b8f773",
  }));
}
