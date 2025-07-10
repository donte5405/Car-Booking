//@ts-check
import { buildBody } from "../body.js";
import {
  Button,
  Dandelion,
  getNodeById,
  HorizontalLine,
  InputText,
  Label,
  Node,
  Percent,
  Px,
  Table,
  TextArea,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);
  // TODO: Add car add/edit menu.
  title.Text("จัดการรถยนต์ส่วนกลาง");

  let carData = {};
  const storageData = window.sessionStorage.getItem("carData");
  if (storageData) {
    carData = JSON.parse(storageData);
  }

  content.Add(
    new Node("Title")
      .HorCenter()
      .Add(
        new Label("Lb", "h2")
          .Text("จัดการรถยนต์ส่วนกลาง"),
      ),
    new Node("CarLicenseId")
      .HorLeft()
      .Add(
        new Label()
          .Text("ป้ายทะเบียน"),
        new InputText("#LicenseId")
          .Stretch()
          .InputValue(carData.licenseId || ""),
      ),
    new Node("CarMileage")
      .HorLeft()
      .Add(
        new Label()
          .Text("เลขไมล์ที่บันทึกไว้ล่าสุด"),
        new InputText("#Mileage")
          .Stretch()
          .InputValue(carData.licenseId || ""),
      ),
    new Node("CarName")
      .HorLeft()
      .Add(
        new Label()
          .Text("ชื่อ และข้อมูลรายละเอียดรถ"),
        new TextArea("#Name")
          .Stretch()
          .LockWidth(Percent(100))
          .MinHeight(Px(128))
          .Text(carData.name || ""),
      ),
    new Node("Submit")
      .HorRight()
      .Add(
        new Button()
          .Text("บันทึกข้อมูล")
          .OnClick(async () => {
            const process = createNotifyDialog("กำลังบันทึกข้อมูล . . .");
            const res = await request({
              method: "car",
              id: carData.id || "",
              name: getNodeById("Name", InputText).value || "",
              mileage: getNodeById("Mileage", InputText).value,
              licenseId: getNodeById("LicenseId", InputText).value,
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
              () => window.location.href = "../cars",
            );
          }),
      ),
  );
});
