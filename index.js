//@ts-check
import { BorderRadius, Style } from "./dandelion/dandelion.css.js";
import {
  Button,
  Container,
  Dandelion,
  DialogBody,
  DropDownMenu,
  DropDownOption,
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
  WindowNode,
} from "./dandelion/dandelion.js";
import { UseDefaultTheme } from "./dandelion/default.css.js";
import { createNotifyDialog } from "./module/dialog.js";
import { request } from "./module/google.js";

UseDefaultTheme();

Dandelion((body) => {
  body
    ._Title("ระบบขอใช้รถออนไลน์")
    ._Add(
      new Node("App")
        ._FlexContainer()
        ._HorCenter()
        ._Add(
          new Container("Main")
            ._OnSmallScreen((node) => node._Width(Percent(100)))
            ._OnBigScreen((node) => node._Width(Px(640)))
            ._Width(Px(240))
            ._HorCenter()
            ._Panel()
            ._Add(
              new Label("LbTitle", "h1")
                ._Text("ระบบขอใช้รถออนไลน์"),
              new Node("RequesterName")
                ._Add(
                  new Label("Lb", "p")
                    ._Bold()
                    ._HorLeft()
                    ._Text("ชื่อผู้ที่ร้องขอ"),
                  new InputText("Text")
                    ._PlaceholderText("กรอกชื่อ - นามสกุลของท่าน"),
                ),
              new Node("RequesterEmail")
                ._Add(
                  new Label("Lb", "p")
                    ._Bold()
                    ._HorLeft()
                    ._Text("อีเมลของผู้ที่ร้องขอ"),
                  new InputEmail("Text")
                    ._PlaceholderText(
                      "กรอก E-mail ของท่าน เช่น johndoe@gmail.com",
                    ),
                ),
              new Node("RequesterDepartment")
                ._Add(
                  new Label("Lb", "p")
                    ._Bold()
                    ._HorLeft()
                    ._Text("แผนกของผู้ที่ร้องขอ"),
                  new DropDownMenu("Text")
                    ._Options(
                      new DropDownOption("แผนกห้องฉุกเฉิน", "ERD - แผนกห้องฉุกเฉิน"),
                      new DropDownOption("แผนกรังสีวินิจฉัย", "RAD - แผนกรังสีวินิจฉัย"),
                      new DropDownOption(
                        "แผนกตรวจสุขภาพ",
                        "HCC - แผนกตรวจสุขภาพ",
                      ),
                      new DropDownOption("แผนกการเงิน", "OIC - แผนกการเงิน"),
                      new DropDownOption("แผนกเภสัชกรรม", "PHD - แผนกเภสัชกรรม"),
                      new DropDownOption("แผนกผู้ป่วยนอก", "OPD - แผนกผู้ป่วยนอก"),
                      new DropDownOption(
                        "แผนกเด็ก (กุมารเวช)",
                        "PED - แผนกเด็ก (กุมารเวช)",
                      ),
                      new DropDownOption(
                        "แผนกบริการส่วนหน้า (Regis)",
                        "CRM - แผนกบริการส่วนหน้า (Regis)",
                      ),
                      new DropDownOption(
                        "แผนกประกันและสิทธิประโยชน์",
                        "URD - แผนกประกันและสิทธิประโยชน์",
                      ),
                      new DropDownOption(
                        "แผนกเคลื่อนย้ายผู้ป่วย (Porter)",
                        "PTD - แผนกเคลื่อนย้ายผู้ป่วย (Porter)",
                      ),
                      new DropDownOption("แผนกคลังยา", "INV - แผนกคลังยา"),
                      new DropDownOption(
                        "แผนกคลังเวชภัณฑ์ปลอดเชื้อ",
                        "CSD - แผนกคลังเวชภัณฑ์ปลอดเชื้อ",
                      ),
                      new DropDownOption(
                        "แผนกหอผู้ป่วยวิกฤต",
                        "ICU - แผนกหอผู้ป่วยวิกฤต",
                      ),
                      new DropDownOption(
                        "แผนกห้องคลอดและเด็กแรกเกิด",
                        "LRN - แผนกห้องคลอดและเด็กแรกเกิด",
                      ),
                      new DropDownOption("แผนกห้องผ่าตัด", "ORD - แผนกห้องผ่าตัด"),
                      new DropDownOption(
                        "แผนกศูนย์ปฏิบัติการสวนหลอดเลือดหัวใจ",
                        "CLD - แผนกศูนย์ปฏิบัติการสวนหลอดเลือดหัวใจ",
                      ),
                      new DropDownOption("แผนกโภชนาการ", "DND - แผนกโภชนาการ"),
                      new DropDownOption(
                        "แผนกห้องปฏิบัติการชันสูตร",
                        "LBD - แผนกห้องปฏิบัติการชันสูตร",
                      ),
                      new DropDownOption(
                        "แผนกเวชศาสตร์ฟื้นฟูและกายภาพบำบัด",
                        "RTD - แผนกเวชศาสตร์ฟื้นฟูและกายภาพบำบัด",
                      ),
                      new DropDownOption(
                        "แผนกเทคโนโลยีสารสนเทศ",
                        "ITD - แผนกเทคโนโลยีสารสนเทศ",
                      ),
                      new DropDownOption("แผนกบัญชี", "ACC - แผนกบัญชี"),
                      new DropDownOption(
                        "แผนกสื่อสารการตลาด",
                        "MKD - แผนกสื่อสารการตลาด",
                      ),
                      new DropDownOption("สำนักผู้ตรวจการ", "SUP - สำนักผู้ตรวจการ"),
                      new DropDownOption(
                        "แผนกทรัพยากรบุคคล",
                        "HRD - แผนกทรัพยากรบุคคล",
                      ),
                      new DropDownOption("สำนักเลขานุการ", "SEC - สำนักเลขานุการ"),
                      new DropDownOption("สำนักผู้บริหาร", "EXC - สำนักผู้บริหาร"),
                      new DropDownOption("องค์กรแพทย์", "MAO - องค์กรแพทย์"),
                      new DropDownOption("แผนกจัดซื้อ", "PUR - แผนกจัดซื้อ"),
                      new DropDownOption(
                        "แผนกศูนย์คุณภาพและควบคุมเอกสาร",
                        "QMD - แผนกศูนย์คุณภาพและควบคุมเอกสาร",
                      ),
                      new DropDownOption(
                        "ฝ่ายสนับสนุนทั่วไป",
                        "GSD - ฝ่ายสนับสนุนทั่วไป",
                      ),
                      new DropDownOption(
                        "แผนกเครื่องมือแพทย์",
                        "MED - แผนกเครื่องมือแพทย์",
                      ),
                      new DropDownOption(
                        "แผนกหอผู้ป่วยใน ชั้น 5",
                        "WA5 - แผนกหอผู้ป่วยใน ชั้น 5",
                      ),
                      new DropDownOption(
                        "แผนกหอผู้ป่วยใน ชั้น 6",
                        "WA6 - แผนกหอผู้ป่วยใน ชั้น 6",
                      ),
                      new DropDownOption(
                        "ผู้อำนวยการโรงพยาบาล",
                        "ผู้อำนวยการโรงพยาบาล",
                      ),
                    ),
                ),
              new Node("RequesterReasons")
                ._Add(
                  new Label("Lb", "p")
                    ._HorLeft()
                    ._Bold()
                    ._Text("เหตุผลที่ขอใช้รถ"),
                  new TextArea("Text")
                    ._LockWidth(Percent(100))
                    ._MinHeight(Px(200))
                    ._PlaceholderText("กรุณาระบุเหตุผลที่ต้องการใช้รถ"),
                ),
              new Node("IsRequestUrgent")
                ._FlexContainer()
                ._Add(
                  new InputCheckBox("CheckBox"),
                  new Label()._Text("มีความเร่งด่วน"),
                ),
              new Node("IsRequestRush")
                ._FlexContainer()
                ._Add(
                  new InputCheckBox("CheckBox"),
                  new Label()._Text("วิ่งทำเวลา"),
                ),
              new HorizontalLine(),
              new Node("RequesterParticipants")
                ._Add(
                  new Label("Lb", "p")
                    ._Bold()
                    ._HorLeft()
                    ._Text("ผู้ที่ร่วมโดยสารไปด้วย"),
                  new TextArea("Text")
                    ._LockWidth(Percent(100))
                    ._MinHeight(Px(200))
                    ._PlaceholderText("กรอกชื่อผู้ที่ร่วมโดยสารไปด้วย หากไม่มีให้เว้นว่าง"),
                ),
              new Node("RequestFrom")
                ._Add(
                  new Label("Lb", "p")
                    ._HorLeft()
                    ._Bold()
                    ._Text("จากเวลา"),
                  new Node("DateTime")
                    ._FlexContainer()
                    ._Add(
                      new Node("Date")
                        ._InternalMargin(Px(0), Px(10), Px(0), Px(0))
                        ._ExternalMargin(Px(0))
                        ._Width(Percent(50))
                        ._HorLeft()
                        ._Add(
                          new InputDatePicker("Text"),
                        ),
                      new Node("Time")
                        ._InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        ._ExternalMargin(Px(0))
                        ._Width(Percent(50))
                        ._HorRight()
                        ._Add(
                          new InputTime("Text"),
                        ),
                    ),
                ),
              new Node("RequestTo")
                ._Add(
                  new Label("Lb", "p")
                    ._HorLeft()
                    ._Bold()
                    ._Text("ถึงเวลา"),
                  new Node("DateTime")
                    ._FlexContainer()
                    ._Add(
                      new Node("Date")
                        ._InternalMargin(Px(0), Px(10), Px(0), Px(0))
                        ._ExternalMargin(Px(0))
                        ._Width(Percent(50))
                        ._HorLeft()
                        ._Add(
                          new InputDatePicker("Text"),
                        ),
                      new Node("Time")
                        ._InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        ._ExternalMargin(Px(0))
                        ._Width(Percent(50))
                        ._HorRight()
                        ._Add(
                          new InputTime("Text"),
                        ),
                    ),
                ),
              new Node("Submit")
                ._Add(
                  new Button("Button")
                    ._Text("ส่งคำร้องขอ")
                    ._OnClick(async (node) => {
                      const d = createNotifyDialog("กำลังส่งข้อมูล โปรดรอสักครู่...");
                      const res = await request("request=request", {
                        requesterName: requesterName.value,
                        requesterEmail: requesterEmail.value,
                        requesterDepartment: requesterDepartment.value,
                        requesterReasons: requesterReasons.value,
                        isRequestUrgent: isRequestUrgent.isChecked,
                        isRequestRush: isRequestRush.isChecked,
                        requesterParticipants: requesterParticipants.value,
                        requestFromDate: requestFromDate.value,
                        requestFromTime: requestFromTime.value,
                        requestToDate: requestToDate.value,
                        requestToTime: requestToTime.value,
                      });
                      if (d.parent) {
                        d.detach();
                      }
                      createNotifyDialog(res.success ? "ส่งคำขอเรียบร้อยแล้ว" : "ล้มเหลว: " + res.error);
                    }),
                ),
            ),
        ),
    );

  const main = body.getNode("App/Main", Node);
  const requesterName = main.getNode("RequesterName/Text", InputText);
  const requesterEmail = main.getNode("RequesterEmail/Text", InputEmail);
  const requesterDepartment = main.getNode(
    "RequesterDepartment/Text",
    DropDownMenu,
  );
  const requesterReasons = main.getNode("RequesterReasons/Text", TextArea);
  const isRequestUrgent = main.getNode(
    "IsRequestUrgent/CheckBox",
    InputCheckBox,
  );
  const isRequestRush = main.getNode("IsRequestRush/CheckBox", InputCheckBox);
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
});
