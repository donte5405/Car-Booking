function post_carReject(data) {
  const requestUid = data.id;
  const approverToken = data.token;
  const rejectReasons = data.reasons;
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }

  const [ getRequest, setRequest, commitRequest ] = queryRequest(spreadsheet, requestUid);
  if (!getRequest) {
    return requestInvalid;
  }

  if (getRequest("IsRequestApproved") !== "⏳") {
    Logger.log("Can't reject the already-approved request");
    return requestInvalid;
  }

  if (getRequest("ApproverToken") !== approverToken) {
    Logger.log("Approver token invalid.");
    return requestInvalid;
  }

  const [getHod] = queryHod(spreadsheet, data.email || getRequest("RequesterDepartment")); // Either specified approver email or department code
  if (!getHod) {
    Logger.log("Request has invalid department code or email.");
    return requestInvalid;
  }

  const emailBody = renderTemplatePage(
    "Mails/RequestRejected",
    {
      approverName: getHod("HodName"),
      rejectReasons: rejectReasons,
    },
  ).getContent();
  setRequest("ApproverEmail", getHod("Email"));
  setRequest("ApproverReasons", rejectReasons);
  setRequest("IsRequestApproved", "❌");
  commitRequest();

  sendEmail({
    to: getRequest("RequesterEmail"),
    subject: "[Car Booking] คำขออนุญาตใช้รถส่วนกลางของคุณ ถูกปฏิเสธ",
    htmlBody: emailBody,
  }, data);

  return { success: "reject-success" };
}

function test_carReject() {
  Logger.log(post_carReject({
    debug: true,
    id: "ad1cedcc-fadd-492a-bde1-19b15d5bf50b",
    token: "9166f052-04e5-49ff-a1be-d003c4005445",
    reasons: "Test reject reasons.",
  }));
}
