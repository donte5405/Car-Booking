//@ts-check
import { buildBody } from "../body.js";
import {
  Button,
  Dandelion,
  Label,
  Node,
  Px,
  Table,
} from "../dandelion/dandelion.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";
import { formatThaiDate } from "../module/thaidate.js";

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);

  // Clear old re requestData.
  window.sessionStorage.removeItem("requestData");

  // Loading phase.
  content.Add(
    new Label("LbLoading", "p")
      .Text("⏳ กำลังโหลดรายการคำร้องขอ..."),
  );

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

    res.success.reverse();

    for (const row of res.success) {
      row.approveButton = row.approved !== "❌"
        ? new Button().Text("จัดสรร")
          .OnClick(() => {
            window.sessionStorage.setItem("requestData", JSON.stringify(row));
            window.location.href = "../allocate/";
          })
        : new Node();
    }

    content
      .Set(
        new Label("LbTitle", "h2")
          .Text("รายการคำร้องขอทั้งหมด"),
        new Label().Text("อัปเดตครั้งล่าสุดเมื่อ " + formatThaiDate()),
        new Label().Italic().Text(
          "กรณีที่ต้องใช้รถอย่างเร่งด่วน ให้ผู้ร้องขอ ขอคำอนุมัติจาก HoD/ผู้บังคับบัญชาทางวาจา/โทรศัพท์ จึงค่อยดำเนินการจัดสรรรถ",
        ),
        new Table("#Table")
          .FitHor()
          .ExternalMargin(Px(16))
          .BooleanTrue(() => new Label().Text("✅"))
          .BooleanFalse(() => new Label().Text("❌"))
          .ColumnHeaders(
            ["approveButton", "จัดสรรการใช้รถ", Px(152)],
            ["approved", "อนุมัติ", Px(64)],
            ["from", "เวลาที่เดินทาง", Px(154)],
            ["to", "เวลาเดินทางกลับ", Px(154)],
            ["name", "ชื่อ - สกุล", Px(256)],
            ["department", "แผนก", Px(128)],
            ["urgent", "เร่งด่วน", Px(64)],
            ["rush", "วิ่งทำเวลา", Px(96)],
            ["reasons", "เหตุผล", Px(256)],
            ["carName", "รถยนต์", Px(128)],
            ["participants", "ผู้ร่วมเดินทาง", Px(128)],
            ["time", "เวลาที่ร้องขอ", Px(154)],
          )
          .RenderJsonArray(res.success),
      );
  };

  setInterval(func, 15000);
  func();
});
