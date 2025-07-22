//@ts-check
import { buildBody } from "../body.js";
import {
  Button,
  Dandelion,
  getNodeById,
  InputText,
  Label,
  Node,
  Percent,
  Px,
  TextArea,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);
  
  let driverData = {};
  const storageData = window.sessionStorage.getItem("driverData");
  if (storageData) {
    driverData = JSON.parse(storageData);
  }
  const isNew = driverData.id ? false : true;
  const strTitle = (isNew ? "เพิ่ม" : "แก้ไข") + "ข้อมูลพลขับ";
  
  title.Text(strTitle);
  content.Add(
    new Node("Title")
      .HorCenter()
      .Add(
        new Label("Lb", "h2")
          .Text(strTitle),
      ),
    new Node("DriverName")
      .HorLeft()
      .Add(
        new Label()
          .Text("ชื่อ - นามสกุลพลขับ"),
        new TextArea("#Name")
          .Stretch()
          .LockWidth(Percent(100))
          .MinHeight(Px(128))
          .Text(driverData.name || ""),
      ),
    new Node("DriverEmail")
      .HorLeft()
      .Add(
        new Label()
          .Text("ที่อยู่ Email"),
        new TextArea("#Email")
          .Stretch()
          .LockWidth(Percent(100))
          .MinHeight(Px(128))
          .Text(driverData.email || ""),
      ),
    new Node("Submit")
      .HorRight()
      .Add(
        new Button()
          .Text("บันทึกข้อมูล")
          .OnClick(async () => {
            const process = createNotifyDialog("กำลังบันทึกข้อมูล . . .");
            const res = await request({
              method: "driver",
              id: driverData.id || "",
              name: getNodeById("Name", InputText).value || "",
              email: getNodeById("Email", InputText).value || "",
            });

            if (process.parent) {
              process.detach();
            }

            if (!res.success) {
              createNotifyDialog("❌ ผิดพลาด: " + res.error);
              return;
            }

            createNotifyDialog(
              "✅ บันทึกรายการเรียบร้อยแล้ว",
              () => window.location.href = "../drivers",
            );
          }),
      ),
  );
});
