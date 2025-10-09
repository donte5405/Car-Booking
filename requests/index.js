//@ts-check
import { buildBody } from "../body.js";
import {
  AudioNode,
  Button,
  Dandelion,
  HorizontalLine,
  Label,
  Node,
  Px,
  Table,
} from "../dandelion/dandelion.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";
import { formatThaiDate, parseThaiDate } from "../module/thaidate.js";

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);
  const audio = new AudioNode();
  audio.Source("../res/ringtone.mp3");
  audio.hide();

  // Clear old re requestData.
  window.sessionStorage.removeItem("requestData");

  // Loading phase.
  content.Add(
    new Label("LbLoading", "p")
      .Text("⏳ กำลังโหลดรายการคำร้องขอ..."),
  );

  /** @type {[string,string,string][]} */
  const headers = [
    ["approveButton", "จัดสรรการใช้รถ", Px(152)],
    ["approved", "อนุมัติ", Px(64)],
    ["from", "เวลาที่เดินทาง", Px(154)],
    ["to", "เวลาเดินทางกลับ", Px(154)],
    ["name", "ชื่อ - สกุล", Px(256)],
    ["department", "แผนก", Px(128)],
    ["urgent", "ขอเร่งด่วน", Px(64)],
    ["rush", "วิ่งทำเวลา", Px(96)],
    ["reasons", "เหตุผล", Px(256)],
    ["carName", "รถยนต์", Px(128)],
    ["participants", "ผู้ร่วมเดินทาง", Px(128)],
    ["time", "เวลาที่ร้องขอ", Px(154)],
  ];

  let loaded = false;
  let currentRequests = [];
  const hasNewRequests = (newRequests) => {
    const oldRequests = currentRequests;
    currentRequests = [...newRequests]; // Full copy to prevent missing arrays

    if (!loaded) {
      loaded = true;
      return; // Don't notify when launching first time
    }

    let foundCount = 0;
    for (const newRequest of newRequests) {
      for (const oldRequest of oldRequests) {
        if (oldRequest.id === newRequest.id) {
          foundCount ++;
          break;
        }
      }
    }

    
    if (foundCount != newRequests.length) {
      console.log("Notification sound");
      audio.play();
    }
  };

  const func = async () => {
    const res = await request({
      method: "requests",
    });

    if (!res.success) {
      if (res.error === "unauthorised") {
        window.location.href = "../auth/";
        return;
      }
      createNotifyDialog("❌ การโหลดล้มเหลว: " + res.error);
      return;
    }

    const requests = res.success;
    hasNewRequests(requests);
    for (const row of requests) {
      row.approveButton = row.approved !== "❌"
        ? new Button().Text("จัดสรร")
          .OnClick(() => {
            window.sessionStorage.setItem("requestData", JSON.stringify(row));
            window.location.href = "../allocate/";
          })
        : new Node();
    }

    let i = 0;
    const now = new Date().getTime();
    const doneRequests = [];
    while (i < requests.length) {
      const request = requests[i];
      const requestTo = parseThaiDate(request.to);
      if (requestTo.getTime() < now) {
        doneRequests.push(requests.splice(i, 1)[0]);
        continue;
      }
      i++;
    }

    content.Set(audio);
    if (requests.length) {
      content.Add(
        new Label("LbTitle", "h2")
          .Style("color", "red")
          .Text("📬 รายการคำร้องขอที่ต้องดำเนินการ"),
        new Label().Text("อัปเดตครั้งล่าสุดเมื่อ " + formatThaiDate()),
        new Label()
          .Style("color", "red")
          .Italic()
          .Text(
            "กรณีที่ต้องใช้รถอย่างเร่งด่วน ให้ผู้ร้องขอ ขอคำอนุมัติจาก HoD/ผู้บังคับบัญชาทางวาจา/โทรศัพท์ จึงค่อยดำเนินการจัดสรรรถ",
          ),
        new Table("#Table")
          .FitHor()
          .ExternalMargin(Px(16))
          .BooleanTrue(() => new Label().Text("✅"))
          .BooleanFalse(() => new Label().Text("❌"))
          .ColumnHeaders(...headers)
          .RenderJsonArray(requests),
      );
    }

    if (doneRequests.length) {
      content.Add(
        new HorizontalLine(),
        new HorizontalLine(),
        new Label("LbTitle2", "h2")
          .Text("🗑️ รายการคำร้องขอที่ผ่านมา"),
        new Label().Text("อัปเดตครั้งล่าสุดเมื่อ " + formatThaiDate()),
        new Label().Italic().Text(
          "รวมรายการคำขอที่ได้ดำเนินการเสร็จสิ้นไปแล้ว คุณยังสามารถจัดสรรเพื่อให้ข้อมูลสัมพันธ์กับที่เกิดขึ้นจริงได้",
        ),
        new Table("#Table")
          .FitHor()
          .ExternalMargin(Px(16))
          .BooleanTrue(() => new Label().Text("✅"))
          .BooleanFalse(() => new Label().Text("❌"))
          .ColumnHeaders(...headers)
          .RenderJsonArray(doneRequests),
      );
    }
  };

  setInterval(func, 15000);
  func();
});
