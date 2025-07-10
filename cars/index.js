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

  window.sessionStorage.removeItem("carData");

  sidebar.Add(
    new HorizontalLine(),
    new Label()
      .HorCenter()
      .Bold()
      .Text("จัดการรถ"),
    new Button()
      .Text("➕ เพิ่มรถคันใหม่")
      .OnClick(() => {
        window.location.href = "../car/";
      }),
  );
  content.Add(
    new Label("LbLoading", "p")
      .Text("⏳ กำลังโหลดรายการรถ..."),
  );

  const res = await request({
    method: "cars",
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

  const cars = [...res.success.available, ...res.success.unavailable];
  console.log(cars);
  for (const car of cars) {
    car.editButton = new Button().Text("แก้ไขข้อมูลรถ")
      .OnClick(() => {
        window.sessionStorage.setItem("carData", JSON.stringify(car));
        window.location.href = "../car/";
      });
  }

  content
    .Set(
      new Label("LbTitle", "h2")
        .Text("รายการรถทั้งหมด"),
      new Table("#Table")
        .FitHor()
        .ExternalMargin(Px(16))
        .ColumnHeaders(
          ["licenseId", "เลขป้ายทะเบียน", Px(64)],
          ["name", "ชื่อ และข้อมูลรายละเอียดรถ", Px(256)],
          ["mileage", "เลขไมล์", Px(64)],
          ["editButton", "แก้ไข", Px(64)],
        )
        .RenderJsonArray(cars),
    );
});
