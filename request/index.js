//@ts-check
import {
  Button,
  Container,
  Dandelion,
  DialogBody,
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
  List,
  ListItem,
  Node,
  Percent,
  Px,
  TextArea,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";
import { formatThaiDate, parseThaiDate } from "../module/thaidate.js";
import { checkVersion } from "../module/ver.js";

const eol = `\n`;

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

  let selectedDepartment = "";
  let selectedCarName = "";
  let selectedFrom = "";
  let selectedTo = "";
  let setReasons = "";

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
                      // new DropDownOption("CSD - แผนกคลังเวชภัณฑ์ปลอดเชื้อ"),
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
                      window.localStorage.getItem("requesterDepartment") ||
                        "ERD - แผนกห้องฉุกเฉิน",
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
                  new InputCheckBox("CheckBox")
                    .On("change", (node) => {
                      if (node.isChecked) {
                        requestUrgentDescription.show();
                      } else {
                        requestUrgentDescription.hide();
                      }
                    }),
                  new Label().Text("ขอใช้เร่งด่วน"),
                ),
              new Node("RequestUrgentDescription")
                .HorLeft()
                .Hidden()
                .Add(
                  new Label()
                    .Style("color", "red")
                    .Text("การขอใช้รถเร่งด่วน คือ การขอใช้รถที่อาจต้องข้ามขั้นตอนการอนุมัติ โดยแจ้งหัวหน้าหรือผู้ตรวจการผ่านโทรศัพท์ และแจ้งหัวหน้าอนุมัติให้ผ่าน Email ภายหลัง เช่น ขอรถเวลา 10.00 น. ต้องออกเดินทาง 10.15 น. \"ไม่เกี่ยวข้องกับการขอให้วิ่งรถเร็วขึ้น\""),
                  new Label()
                    .Style("color", "red")
                    .Text("หากท่านต้องการให้พนักงานขับรถ ขับรถอย่างเร่งด่วน ให้เลือกตัวเลือก \"วิ่งทำเวลา\" (ขอไม่ได้ทุกเคส)"),
                ),
              new Node("IsRequestRush")
                .FlexContainer()
                .Add(
                  new InputCheckBox("CheckBox")
                    .On("change", (node) => {
                      if (node.isChecked) {
                        requestRushDescription.show();
                      } else {
                        requestRushDescription.hide();
                      }
                    }),
                  new Label().Text("วิ่งทำเวลา"),
                ),
              new Node("RequestRushDescription")
                .HorLeft()
                .Hidden()
                .Add(
                  new Label()
                    .Style("color", "red")
                    .Text("การขอวิ่งรถทำเวลา คือ การขอให้พนักงานขับรถทำความเร็วมากกว่าปกติ ซึ่งก่อให้เกิดความเสี่ยงต่าง ๆ ขึ้น เช่น อุบัติเหตุ การฝ่าฝืนกฎหมายจราจร"),
                  new Label()
                    .Style("color", "#D9544D")
                    .Text("ตัวอย่าง: วันนี้วันที่ 1 มกราคม 2569 ต้องไปรับเซ็ตผ่าตัดวันที่ 20 มกราคม 2569 08.00 น. ที่โรงพยาบาลไกลถิ่น แต่ต้องกลับมาเวลา 13.00 น. (5 ชม.) เพราะต้องเข้าเคส 15.00 น."),
                  new Label()
                    .Style("color", "red")
                    .Text("ผู้ตรวจการ จะต้องประเมินเหตุผลและความเสี่ยงของการขอวิ่งรถทำเวลานี้ก่อนอนุมัติ"),
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
              new Node("Approver")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("เลือกผู้อนุมัติ"),
                  new DropDownMenu("Text")
                    .On("change", (node) => {
                      window.localStorage.setItem(
                        "approver",
                        node.value,
                      );
                      if (node.value === "hod") {
                        altApproverReasonsNode.hide();
                      } else {
                        altApproverReasonsNode.show();
                      }
                    })
                    .Options(
                      new DropDownOption("hod", "หัวหน้า / ผู้บังคับบัญชา"),
                      new DropDownOption("sup", "ผู้ตรวจการ (Supervisor)"),
                      new DropDownOption("porter", "หัวหน้าแผนกเคลื่อนย้ายผู้ป่วย"),
                    )
                    .InputValue(
                      window.localStorage.getItem("approver") || "hod",
                    ),
                ),
              new Node("AltApproverReasons")
                .Hidden()
                .Add(
                  new Label("Lb", "p")
                    .HorLeft()
                    .Bold()
                    .Text(
                      "เหตุผลที่ต้องให้ผู้อนุมัติเป็นผู้อื่นที่ไม่ใช่ผู้บังคับบัญชา",
                    ),
                  new TextArea("Text")
                    .LockWidth(Percent(100))
                    .MinHeight(Px(200))
                    .On("change", (node) => {
                      window.localStorage.setItem("altApproverReasons", node.value);
                    })
                    .Value(window.localStorage.getItem("altApproverReasons") || "")
                    .PlaceholderText(
                      "ระบุเหตุผล เช่น ผู้บังคับบัญชาไม่สะดวกอนุมัติ, ผู้บังคับบัญชาติดภารกิจอื่น ๆ, เป็นผู้ตรวจการ, ฯลฯ",
                    ),
                ),
              new List()
                .Add(
                  new ListItem()
                    .Add(
                      new Label("ApproverSelectionTips0", "p")
                        .HorLeft()
                        .Italic()
                        .Text("ในกรณีทั่วไป ผู้อนุมัติจะเป็นผู้บังคับบัญชาของแผนกที่ท่านสังกัด"),
                    ),
                  new ListItem()
                    .Add(
                      new Label("ApproverSelectionTips1", "p")
                        .HorLeft()
                        .Italic()
                        .Text(
                          'ในกรณีที่ผู้ร้องขอเป็นหัวหน้างาน / HoD, เลขาแพทย์ ให้เลือกผู้อนุมัติเป็น "หัวหน้า / ผู้บังคับบัญชา" แล้วอนุมัติให้ตนเองผ่าน Email ประจำตำแหน่ง',
                        ),
                    ),
                  new ListItem()
                    .Add(
                      new Label("ApproverSelectionTips1", "p")
                        .HorLeft()
                        .Italic()
                        .Text(
                          'ในกรณีที่ผู้ร้องขอเป็นผู้ตรวจการ ให้เลือกผู้อนุมัติเป็น "ผู้ตรวจการ" ระบุเหตุผลเป็น "ผู้ตรวจการ" และอนุมัติให้ตนเองผ่าน Email ประจำตำแหน่ง',
                        ),
                    ),
                  new ListItem()
                    .Add(
                      new Label("ApproverSelectionTips2", "p")
                        .HorLeft()
                        .Italic()
                        .Text(
                          "ในกรณีที่ผู้บังคับบัญชาไม่สามารถอนุมัติได้ ให้เลือกผู้อนุมัติเป็นผู้ตรวจการหรือหัวหน้าแผนกเคลื่อนย้ายผู้ป่วยตามสถานการณ์ พร้อมระบุเหตุผลประกอบการพิจารณา",
                        ),
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
                      if (
                        approver.value !== "hod" &&
                        !altApproverReasons.value.trim()
                      ) {
                        createNotifyDialog(
                          "หากท่านเลือกผู้อนุมัติเป็นบุคคลอื่นที่ไม่ใช่ผู้บังคับบัญชาของท่าน โปรดระบุเหตุผลที่ต้องให้ผู้นั้นอนุมัติด้วย หากท่านเป็น HoD เป็นต้นไป ให้ระบุเป็น \"HoD\" หากท่านเป็นผู้ตรวจการ ให้ระบุเป็น \"ผู้ตรวจการ\"",
                        );
                        return;
                      }
                      selectedFrom = formatThaiDate(new Date(requestFromDate.value + "T" + requestFromTime.value + "+07:00"));
                      selectedTo = formatThaiDate(new Date(requestToDate.value + "T" + requestToTime.value + "+07:00"));
                      selectedCarName = carByIds[requestCar.value].name || "รถ";
                      selectedDepartment = requesterDepartment.value;
                      setReasons = requesterReasons.value;
                      const d = createNotifyDialog(
                        "⏳ กำลังส่งข้อมูล โปรดรอสักครู่...",
                      );
                      const body = {
                        method: "request",
                        requesterName: requesterName.value,
                        requesterEmail: requesterEmail.value,
                        requesterDepartment: selectedDepartment,
                        requestReasons: setReasons,
                        isRequestUrgent: isRequestUrgent.isChecked,
                        isRequestRush: isRequestRush.isChecked,
                        requesterParticipants: requesterParticipants.value,
                        requestFromDate: requestFromDate.value,
                        requestFromTime: requestFromTime.value,
                        requestToDate: requestToDate.value,
                        requestToTime: requestToTime.value,
                        requestCar: requestCar.value,
                        requestAmbulanceComment: requestAmbulanceComment.value,
                        approver: approver.value,
                        altApproverReasons: altApproverReasons.value,
                      };
                      // console.log(body);
                      // return;
                      const res = await request(body);
                      if (d.parent) {
                        d.detach();
                      }
                      if (!res.success) {
                        createNotifyDialog("❌ ล้มเหลว: " + res.error);
                        return;
                      }
                      spawnLINEMessageDialog();
                    }),
                ),
            ),
        ),
        new DialogBody("#CancelRequest")
          .Hidden()
          .Dim()
          .Add(
            new Container()
              .Panel()
              .FlexContainer()
              .FlexDirection("column")
              .FlexWrap("wrap")
              .Width(Px(1024))
              .Height(Px(640))
              .InternalMargin(Px(16))
              .Add(
                new Label("Lb", "h2")
                  .Text("✅ บันทึกคำขอเรียบร้อยแล้ว"),
                new Label()
                  .Text("คัดลอกข้อความเหล่านี้ แล้วนำส่ง Chat กลุ่มขอใช้รถ"),
                new Label()
                  .Style("color", "red")
                  .Text("ระบบไม่นำส่งข้อความให้อัตโนมัติ!"),
                new TextArea("#TextToCopy")
                  .Stretch(),
                new Node()
                  .FlexContainer()
                  .HorCenter()
                  .Add(
                    new Button()
                      .MinWidth(Px(128))
                      .OnClick(() => {
                        spawnLINEMessageDialog("ครับ", true);
                      })
                      .Text("👨 คัดลอกข้อความ \"ครับ\""),
                    new Button()
                      .MinWidth(Px(128))
                      .OnClick(() => {
                        spawnLINEMessageDialog("ค่ะ", true);
                      })
                      .Text("👩 คัดลอกข้อความ \"ค่ะ\""),
                  ),
              ),
          ),
    );

  function spawnLINEMessageDialog(politeEnding = "", setClipboard = false) {
    const todayText = (Math.abs((parseThaiDate(selectedFrom).getTime() - new Date().getTime()) / 86400000) <= 1.0) ?" (วันนี้)" : "";
    const dayLength = Math.abs(parseThaiDate(selectedTo).getTime() - parseThaiDate(selectedFrom).getTime()) / 86400000;
    const froms = selectedFrom.split(" ");
    const tos = selectedTo.split(" ");
    const p = politeEnding;
    let time = "";
    if (dayLength < 1) { // Same day
      time += `📅วันที่ ${froms[0]} ${froms[1]} ${froms[2]}${todayText}` + eol
        + `⏰เวลา ${froms[3]} น. ถึง ${tos[3]} น.`;
    } else {
      time += "📌ช่วงวันที่ " + selectedFrom + todayText + eol
        + "📍ถึงวันที่ " + selectedTo + ` (${Math.floor(dayLength)} วัน)`
        ;
    }
    const text = `❗ขออนุญาต${p}` + eol
      + time + eol
      + `👉${selectedDepartment.split(" - ")[1]}` + eol
      + `🚗 ขอใช้${selectedCarName}` + eol
      + eol
      + setReasons + eol
      + eol
      + `✍🏼คีย์ลงในระบบเรียบร้อยแล้ว${p}` + eol
      + `🙏ขอบคุณ${p}`
      ;
    if (setClipboard) {
      createNotifyDialog("✅ คัดลอกข้อความเรียบร้อยแล้ว" + politeEnding);
      navigator.clipboard.writeText(text);
    }
    
    getNodeById("TextToCopy", InputText).value = text;
    getNodeById("CancelRequest", Node).show();
  }

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
  const requestUrgentDescription = main.getNode(
    "RequestUrgentDescription",
    Node
  );
  const isRequestRush = main.getNode(
    "IsRequestRush/CheckBox",
    InputCheckBox,
  );
  const requestRushDescription = main.getNode(
    "RequestRushDescription",
    Node,
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
  const approver = main.getNode(
    "Approver/Text",
    DropDownMenu,
  );
  const altApproverReasonsNode = main.getNode(
    "AltApproverReasons",
    TextArea,
  );
  const altApproverReasons = main.getNode(
    "AltApproverReasons/Text",
    TextArea,
  );

  if (approver.value !== "hod") {
    altApproverReasonsNode.show();
  }

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
  /** @type {Record<string,{id:string,name:string,licenseId:string}>} */
  const carByIds = {};

  for (const car of cars) {
    if (!carByIds[car.id]) {
      carByIds[car.id] = car;
    }
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
