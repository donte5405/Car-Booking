function post_report_totalDepartment(data) {
  let from = data.from;
  let to = data.to;
  if (!data.from || !data.to) {
    return { error: "ข้อมูลจำเป็นไม่ครบถ้วน" };
  }
  let fromTime;
  let toTime;
  try {
    fromTime = parseThaiDate(from).getTime();
    toTime = parseThaiDate(to).getTime();
  } catch (e) {
    return { error: "ข้อมูลที่จำเป็นไม่ถูกต้อง: " + e.message };
  }

  // Pull data and store to dict
  const dict = {};
  const push = (getter) => {
    let reqFrom = parseThaiDate(getter("RequestFrom")).getTime();
    let reqTo = parseThaiDate(getter("RequestTo")).getTime();
    if (!isOverlapped(reqFrom, reqTo, fromTime, toTime)) {
      return;
    }
    const dep = getter("RequesterDepartment");
    reqFrom /= 3600000;
    reqTo /= 3600000;
    if (!dict[dep]) {
      dict[dep] = {
        name: dep,
        total: 0,
        totalHours: 0,
      };
    }
    const data = dict[dep];
    data.total += 1;
    data.totalHours += reqTo - reqFrom;
  };
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    return { error: "Spreadsheet ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"};
  }
  
  const [ requestsSheet, requests ] = getSheet(spreadsheet, "Requests");
  const [ archivedSheet, archived ] = getSheet(spreadsheet, "ArchivedRequests");
  for (const [ getRequest ] of requests()) {
    push(getRequest);
  }
  for (const [ getRequest ] of archived()) {
    push(getRequest);
  }

  // Sort data descending
  const list = [];
  for (const key in dict) {
    list.push(dict[key]);
  }
  list.sort((a, b) => b.totalHours - a.totalHours);

  const [ porterEmail ] = getConfig("PorterEmail");
  sendEmail({
    to: porterEmail,
    subject: "[Car Booking] รายงานการใช้รถยนต์ส่วนกลางรายแผนก เวลา " + formatThaiDate(),
    htmlBody: include("Mails/Reports/TotalDepartment", { from, to, list, year: new Date().getFullYear() }),
  }, data);
  return { success: porterEmail };
}

function test_report_totalDepartment() {
  post_report_totalDepartment({
    debug: true,
    from: "1 กรกฎาคม 2568 00.00 น.",
    to: "8 กันยายน 2568 23.59 น.",
  });
}
