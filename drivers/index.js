//@ts-check
import { buildBody } from "../body.js";
import {
  Button,
  Dandelion,
  HorizontalLine,
  Label,
  Px,
  Table,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);

  window.sessionStorage.removeItem("driverData");

  sidebar.Add(
    new HorizontalLine(),
    new Label()
      .HorCenter()
      .Bold()
      .Text("บริหารพลขับ"),
    new Button()
      .Text("➕ เพิ่มพลขับใหม่")
      .OnClick(() => {
        window.location.href = "../driver/";
      }),
  );
  content.Add(
    new Label("LbLoading", "p")
      .Text("⏳ กำลังโหลดรายชื่อพลขับ..."),
  );

  const res = await request({
    method: "drivers",
    id: "",
  });

  if (!res.success) {
    if (res.error === "unauthorised") {
      window.location.href = "../auth/";
      return;
    }
    createNotifyDialog("❌ การโหลดล้มเหลว: " + res.error);
    return;
  }

  const drivers = res.success;
  console.log(drivers);
  for (const driver of drivers) {
    driver.editButton = new Button().Text("แก้ไขข้อมูลพลขับ")
      .OnClick(() => {
        window.sessionStorage.setItem("driverData", JSON.stringify(driver));
        window.location.href = "../driver/";
      });
  }

  content
    .Set(
      new Label("LbTitle", "h2")
        .Text("รายการพลขับทั้งหมด"),
      new Table("#Table")
        .FitHor()
        .ExternalMargin(Px(16))
        .ColumnHeaders(
          ["name", "ชื่อ - นามสกุล", Px(256)],
          ["email", "ที่อยู่ Email", Px(256)],
          ["editButton", "แก้ไข", Px(64)],
        )
        .RenderJsonArray(drivers),
    );
});
