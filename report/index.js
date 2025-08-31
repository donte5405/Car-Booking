//@ts-check
import { buildBody } from "../body.js";
import {
  BackgroundColor,
  ElementState,
  ForegroundColor,
  MixColors,
  Style,
} from "../dandelion/dandelion.css.js";
import {
  Button,
  Container,
  Dandelion,
  DialogBody,
  getNodeById,
  InputDatePicker,
  InputText,
  InputTime,
  Label,
  Node,
  Percent,
  Px,
  TextArea,
} from "../dandelion/dandelion.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";
import { formatThaiDate, parseThaiDate } from "../module/thaidate.js";

const titleText = "ขอรายงานจากระบบ";

function generateCarText(car) {
  return "🚗 " + car.licenseId + " " + car.name; // + " (เลขไมล์ปัจจุบัน " + String(car.mileage) + ")";
}

Dandelion(async (body) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);
  const mixCol = MixColors("#C70039");
  const cancelButtonTheme = Style(
    new BackgroundColor(mixCol.normal),
    new ElementState("hover").define(
      new BackgroundColor(mixCol.hover),
    ),
    new ElementState("active").define(
      new BackgroundColor(mixCol.pressed),
    ),
  );
  console.log("two");

  title.Text(titleText);
  sidebar.Add(
    new Button()
      .Text("⬅️ ย้อนกลับ")
      .OnClick(() => {
        window.location.href = "../requests";
      }),
  );
  content.Add(
    new Node()
      .HorCenter()
      .Add(
        new Label("Title", "h2")
          .Text(titleText),
        new Node()
          .HorLeft()
          .Add(
            new Button()
              .Text("🫴📄 สรุปจำนวนการขอใช้รถรายแผนก")
              .OnClick(() => requestReport("report-totaldepartment")),
          ),
      ),
    new DialogBody("#SelectDate")
      .Hidden()
      .Dim()
      .Add(
        new Container()
          .Panel()
          .FlexContainer()
          .FlexDirection("column")
          .FlexWrap("wrap")
          .Width(Px(1024))
          .Height(Px(576))
          .Add(
            new Label("#SelectDateTitle", "h2")
              .Text(""),
            new Node("RequestFrom")
              .Add(
                new Label("Lb", "p")
                  .HorLeft()
                  .Bold()
                  .Text("จากเวลา"),
                new Node("DateTime")
                  .FlexContainer()
                  .Add(
                    new Node("Date")
                      .InternalMargin(Px(0), Px(10), Px(0), Px(0))
                      .ExternalMargin(Px(0))
                      .Width(Percent(50))
                      .HorLeft()
                      .Add(
                        new InputDatePicker("#FromDate")
                          .InputValue(`${year}-${month}-01`)
                          .On("change", (node) => {
                            requestFromDate = node.value;
                          }),
                      ),
                    new Node("Time")
                      .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                      .ExternalMargin(Px(0))
                      .Width(Percent(50))
                      .HorRight()
                      .Add(
                        new InputTime("#FromTime")
                          .InputValue(`00:00`)
                          .On("change", (node) => {
                            requestFromTime = node.value;
                          }),
                      ),
                  ),
              ),
            new Node("RequestTo")
              .Add(
                new Label("Lb", "p")
                  .HorLeft()
                  .Bold()
                  .Text("ถึงเวลา"),
                new Node("DateTime")
                  .FlexContainer()
                  .Add(
                    new Node("Date")
                      .InternalMargin(Px(0), Px(10), Px(0), Px(0))
                      .ExternalMargin(Px(0))
                      .Width(Percent(50))
                      .HorLeft()
                      .Add(
                        new InputDatePicker("#ToDate")
                          .InputValue(`${year}-${month}-31`)
                          .On("change", (node) => {
                            requestToDate = node.value;
                          }),
                      ),
                    new Node()
                      .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                      .ExternalMargin(Px(0))
                      .Width(Percent(50))
                      .HorRight()
                      .Add(
                        new InputTime("#ToTime")
                          .InputValue(`23:59`)
                          .On("change", (node) => {
                            requestToTime = node.value;
                          }),
                      ),
                  ),
              ),
            new Node()
              .Add(
                new Button()
                  .Class(cancelButtonTheme)
                  .MinWidth(Px(128))
                  .OnClick(() => {
                    getNodeById("SelectDate", Node).hide();
                  })
                  .Text("ยกเลิก"),
                new Button()
                  .MinWidth(Px(128))
                  .OnClick(() => {
                    if (selectDateResolve) {
                      selectDateResolve();
                    }
                    getNodeById("SelectDate", Node).hide();
                  })
                  .Text("ยืนยัน"),
              ),
          ),
      ),
  );

  /** @type {function} */
  let selectDateResolve;
  let requestFromDate = getNodeById("FromDate", InputDatePicker).value;
  let requestFromTime = getNodeById("FromTime", InputTime).value;
  let requestToDate = getNodeById("ToDate", InputDatePicker).value;
  let requestToTime = getNodeById("ToTime", InputTime).value;

  /**
   * @param {string} reportName
   */
  async function requestReport(reportName) {
    const tzoMinutes = -now.getTimezoneOffset();
    const tzoRmMins = tzoMinutes % 60;
    const tzoHours = (tzoMinutes - tzoRmMins) / 60;
    const tzoString = `${tzoMinutes < 0 ? "-" : "+"}${tzoHours.toString().padStart(2, "0")}:${tzoRmMins.toString().padStart(2, "0")}`;

    // Awaits the dialog
    getNodeById("SelectDate", Node).show();
    getNodeById("SelectDateTitle", Label).Text(
      "เลือกช่วงเวลาที่จะออกรายงาน " + reportName,
    );
    await new Promise((resolve) => selectDateResolve = resolve);

    let dialog = createNotifyDialog(
      "กำลังออกรายงานและส่งไปยัง Email รอสักครู่...",
    );
    const body = {
      method: reportName,
      from: formatThaiDate(new Date(requestFromDate + "T" + requestFromTime + ":00" + tzoString)),
      to: formatThaiDate(new Date(requestToDate + "T" + requestToTime + ":00" + tzoString)),
    };
    const res = await request(body);
    if (dialog.parent) {
      dialog.detach();
    }

    createNotifyDialog(
      res.success
        ? "✅ ส่งรายงานไปยัง Email '" + res.success + "' เรียบร้อยแล้ว"
        : "❌ ผิดพลาด: " + res.error,
    );
  }
});
