//@ts-check
import {
  Button,
  Container,
  Dandelion,
  DropDownMenu,
  DropDownOption,
  getNodeById,
  HorizontalLine,
  InputCheckBox,
  InputDatePicker,
  InputEmail,
  InputText,
  InputTime,
  Label,
  Node,
  Percent,
  Px,
  TextArea,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";
import { checkVersion } from "../module/ver.js";

UseDefaultTheme();

Dandelion(async (body) => {
  checkVersion(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  // const minutes = String(now.getMinutes()).padStart(2, "0");
  // const seconds = String(now.getSeconds()).padStart(2, '0');
  // const ms = String(now.getMilliseconds()).padStart(3, '0');
  body
    .Title("ระบบขอใช้รถออนไลน์")
    .Add(
      new Node("App")
        .FlexContainer()
        .HorCenter()
        .Add(
          new Container("#Main")
            .OnSmallScreen((node) => node.Width(Percent(100)))
            .OnBigScreen((node) => node.Width(Px(640)))
            .Width(Px(240))
            .HorCenter()
            .Panel()
            .Add(
              new Label("LbTitle", "h1")
                .Text("ระบบขอใช้รถออนไลน์"),
              new Button()
                .Text("ดูคำร้องขอที่มีอยู่ทั้งหมด")
                .OnClick(() => {
                  window.location.href = "../schedule";
                }),
              new Node("RequesterName")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("ชื่อผู้ที่ร้องขอ"),
                  new InputText("Text")
                    .AutocompleteEnabled()
                    .PlaceholderText("กรอกชื่อ - นามสกุลของท่าน")
                    .InputValue(
                      window.localStorage.getItem("requesterName") || "",
                    ),
                ),
              new Node("RequesterEmail")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("อีเมลของผู้ที่ร้องขอ"),
                  new InputEmail("Text")
                    .AutocompleteEnabled()
                    .PlaceholderText(
                      "กรอก E-mail ของท่าน เช่น johndoe@gmail.com",
                    )
                    .InputValue(
                      window.localStorage.getItem("requesterEmail") || "",
                    ),
                ),
              new Node("RequesterDepartment")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("แผนกของผู้ที่ร้องขอ"),
                  new DropDownMenu("Text")
                    .On("change", (node) => {
                      window.localStorage.setItem(
                        "requesterDepartment",
                        node.value,
                      );
                    })
                    .Options(
                      new DropDownOption("ERD - แผนกห้องฉุกเฉิน"),
                      new DropDownOption("RAD - แผนกรังสีวินิจฉัย"),
                      new DropDownOption("HCC - แผนกตรวจสุขภาพ"),
                      new DropDownOption("OIC - แผนกการเงิน"),
                      new DropDownOption("PHD - แผนกเภสัชกรรม"),
                      new DropDownOption("OPD - แผนกผู้ป่วยนอก"),
                      new DropDownOption("PED - แผนกเด็ก (กุมารเวช)"),
                      new DropDownOption("CRM - แผนกบริการส่วนหน้า (Regis)"),
                      new DropDownOption("URD - แผนกประกันและสิทธิประโยชน์"),
                      new DropDownOption("PTD - แผนกเคลื่อนย้ายผู้ป่วย (Porter)"),
                      new DropDownOption("INV - แผนกคลังยา"),
                      new DropDownOption("CSD - แผนกคลังเวชภัณฑ์ปลอดเชื้อ"),
                      new DropDownOption("ICU - แผนกหอผู้ป่วยวิกฤต"),
                      new DropDownOption("LRN - แผนกห้องคลอดและทารกแรกเกิด"),
                      new DropDownOption("ORD - แผนกห้องผ่าตัด"),
                      // new DropDownOption("CLD - แผนกศูนย์ปฏิบัติการสวนหลอดเลือดหัวใจ"),
                      // new DropDownOption("DND - แผนกโภชนาการ"),
                      new DropDownOption("LBD - แผนกห้องปฏิบัติการชันสูตร"),
                      new DropDownOption("RTD - แผนกเวชศาสตร์ฟื้นฟูและกายภาพบำบัด"),
                      new DropDownOption("ITD - แผนกเทคโนโลยีสารสนเทศ"),
                      new DropDownOption("ACC - แผนกบัญชี"),
                      new DropDownOption("MKD - แผนกสื่อสารการตลาด"),
                      new DropDownOption("SUP - สำนักผู้ตรวจการ"),
                      new DropDownOption("HRD - แผนกทรัพยากรบุคคล"),
                      new DropDownOption("SEC - สำนักเลขานุการ"),
                      new DropDownOption("EXC - สำนักผู้บริหาร"),
                      new DropDownOption("PUR - แผนกจัดซื้อ"),
                      new DropDownOption("QMD - แผนกศูนย์คุณภาพและควบคุมเอกสาร"),
                      new DropDownOption("GSD - ฝ่ายสนับสนุนทั่วไป"),
                      new DropDownOption("MED - แผนกเครื่องมือแพทย์"),
                      new DropDownOption("WA5 - แผนกหอผู้ป่วยใน ชั้น 5"),
                      new DropDownOption("WA6 - แผนกหอผู้ป่วยใน ชั้น 6"),
                      new DropDownOption("MAO - สำนักผู้อำนวยการโรงพยาบาล"),
                      new DropDownOption("ผู้อำนวยการโรงพยาบาล"),
                    )
                    .InputValue(
                      window.localStorage.getItem("requesterDepartment") || "",
                    ),
                ),
              new Node("RequesterReasons")
                .Add(
                  new Label("Lb", "p")
                    .HorLeft()
                    .Bold()
                    .Text("เหตุผลที่ขอใช้รถ"),
                  new TextArea("Text")
                    .LockWidth(Percent(100))
                    .MinHeight(Px(200))
                    .PlaceholderText("กรุณาระบุเหตุผลที่ต้องการใช้รถ"),
                ),
              new Node("IsRequestUrgent")
                .FlexContainer()
                .Add(
                  new InputCheckBox("CheckBox"),
                  new Label().Text("มีความเร่งด่วน"),
                ),
              new Node("IsRequestRush")
                .FlexContainer()
                .Add(
                  new InputCheckBox("CheckBox"),
                  new Label().Text("วิ่งทำเวลา"),
                ),
              new HorizontalLine(),
              new Node("RequesterParticipants")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("ผู้ที่ร่วมโดยสารไปด้วย"),
                  new TextArea("Text")
                    .LockWidth(Percent(100))
                    .MinHeight(Px(200))
                    .PlaceholderText("กรอกชื่อผู้ที่ร่วมโดยสารไปด้วย หากไม่มีให้เว้นว่าง"),
                ),
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
                          new InputDatePicker("Text")
                            .InputValue(`${year}-${month}-${date}`)
                            .On("change", (node) => {
                              requestToDate.value = node.value;
                            }),
                        ),
                      new Node("Time")
                        .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        .ExternalMargin(Px(0))
                        .Width(Percent(50))
                        .HorRight()
                        .Add(
                          new InputTime("Text")
                            .InputValue(`${hours}:00`)
                            .On("change", (node) => {
                              requestToTime.value = node.value;
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
                          new InputDatePicker("Text")
                            .InputValue(`${year}-${month}-${date}`),
                        ),
                      new Node("Time")
                        .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        .ExternalMargin(Px(0))
                        .Width(Percent(50))
                        .HorRight()
                        .Add(
                          new InputTime("Text")
                            .InputValue(`${hours}:00`),
                        ),
                    ),
                ),
              new Node("RequestCar")
                .FlexContainer()
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("รถที่ต้องการใช้"),
                  new DropDownMenu("Text")
                    .On("change", (node) => {
                      window.localStorage.setItem("requestCar", node.value);
                      showAmbulanceSectionConditionally(node.value);
                    })
                    .Options(
                      new DropDownOption(
                        "loading",
                        "⏳ กำลังโหลดรายการรถ รอสักครู่...",
                      ),
                    ),
                ),
              new Node("RequestAmbulanceComment")
                .Hidden()
                .Add(
                  new Label("Lb", "p")
                    .HorLeft()
                    .Bold()
                    .Text(
                      "ความต้องการเพิ่มเติม (สำหรับรถ Ambulance)",
                    ),
                  new TextArea("Text")
                    .LockWidth(Percent(100))
                    .MinHeight(Px(200))
                    .PlaceholderText(
                      "ระบุความต้องการเพิ่มเติม เช่น ต้องการอุปกรณ์การพยาบาลใด จำนวนเตียง, เปล อื่น ๆ เป็นต้น",
                    ),
                ),
              new Node("Submit")
                .Add(
                  new Button("Button")
                    .Text("ส่งคำร้องขอ")
                    .OnClick(async (node) => {
                      if (!loaded) {
                        createNotifyDialog("เว็บค้าง โปรดโหลดเว็บใหม่แล้วลองอีกครั้ง");
                        return;
                      }

                      // Save frequently used value.
                      window.localStorage.setItem(
                        "requesterName",
                        requesterName.value,
                      );
                      window.localStorage.setItem(
                        "requesterEmail",
                        requesterEmail.value,
                      );
                      window.localStorage.setItem(
                        "requestCar",
                        requestCar.value,
                      );

                      if (
                        !requesterName.value ||
                        !requesterEmail.value ||
                        !requesterDepartment.value ||
                        !requesterReasons.value ||
                        !requestFromDate.value ||
                        !requestFromTime.value ||
                        !requestToDate.value ||
                        !requestToTime.value
                      ) {
                        createNotifyDialog("กรุณาระบุข้อมูลที่จำเป็นให้ครบถ้วน");
                        return;
                      }
                      const d = createNotifyDialog(
                        "⏳ กำลังส่งข้อมูล โปรดรอสักครู่...",
                      );
                      const body = {
                        method: "request",
                        requesterName: requesterName.value,
                        requesterEmail: requesterEmail.value,
                        requesterDepartment: requesterDepartment.value,
                        requestReasons: requesterReasons.value,
                        isRequestUrgent: isRequestUrgent.isChecked,
                        isRequestRush: isRequestRush.isChecked,
                        requesterParticipants: requesterParticipants.value,
                        requestFromDate: requestFromDate.value,
                        requestFromTime: requestFromTime.value,
                        requestToDate: requestToDate.value,
                        requestToTime: requestToTime.value,
                        requestCar: requestCar.value,
                        requestAmbulanceComment: requestAmbulanceComment.value,
                      };
                      // console.log(body);
                      // return;
                      const res = await request(body);
                      if (d.parent) {
                        d.detach();
                      }
                      createNotifyDialog(
                        res.success
                          ? "✅ ส่งคำขอเรียบร้อยแล้ว"
                          : "❌ ล้มเหลว: " + res.error,
                      );
                    }),
                ),
            ),
        ),
    );

  const showAmbulanceSectionConditionally = (id) => {
    requestAmbulanceCommentNode.hide();
    for (const car of cars) {
      if (car.id !== id) {
        continue;
      }
      if (car.isAmbulance) {
        requestAmbulanceCommentNode.show();
      }
      return;
    }
  };

  const main = getNodeById("Main", Node);
  const requesterName = main.getNode(
    "RequesterName/Text",
    InputText,
  );
  const requesterEmail = main.getNode(
    "RequesterEmail/Text",
    InputEmail,
  );
  const requesterDepartment = main.getNode(
    "RequesterDepartment/Text",
    DropDownMenu,
  );
  const requesterReasons = main.getNode(
    "RequesterReasons/Text",
    TextArea,
  );
  const isRequestUrgent = main.getNode(
    "IsRequestUrgent/CheckBox",
    InputCheckBox,
  );
  const isRequestRush = main.getNode(
    "IsRequestRush/CheckBox",
    InputCheckBox,
  );
  const requesterParticipants = main.getNode(
    "RequesterParticipants/Text",
    TextArea,
  );
  const requestFromDate = main.getNode(
    "RequestFrom/DateTime/Date/Text",
    InputDatePicker,
  );
  const requestFromTime = main.getNode(
    "RequestFrom/DateTime/Time/Text",
    InputTime,
  );
  const requestToDate = main.getNode(
    "RequestTo/DateTime/Date/Text",
    InputDatePicker,
  );
  const requestToTime = main.getNode(
    "RequestTo/DateTime/Time/Text",
    InputTime,
  );
  const requestCar = main.getNode(
    "RequestCar/Text",
    DropDownMenu,
  );
  const requestAmbulanceCommentNode = main.getNode(
    "RequestAmbulanceComment",
    Node,
  );
  const requestAmbulanceComment = main.getNode(
    "RequestAmbulanceComment/Text",
    TextArea,
  );

  // Load car list
  let loaded = false;
  let availableCars = [];
  let unavailableCars = [];
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

  const options = [];
  availableCars = res.success.available;
  unavailableCars = res.success.unavailable;
  const cars = [...availableCars, ...unavailableCars];

  for (const car of cars) {
    options.push(
      new DropDownOption(
        car.id,
        car.name + " (" + car.licenseId + ")",
      ),
    );
  }

  const selectedCar = window.localStorage.getItem("requestCar") || cars[0].id;
  requestCar.Options(...options);
  requestCar.InputValue(selectedCar);
  showAmbulanceSectionConditionally(selectedCar);
  loaded = true;
});
