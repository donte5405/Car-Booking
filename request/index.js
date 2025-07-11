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
  Node,
  Percent,
  Px,
  TextArea,
  WindowNode,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion((body) => {
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
              new Node("RequesterName")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("ชื่อผู้ที่ร้องขอ"),
                  new InputText("Text")
                    .PlaceholderText("กรอกชื่อ - นามสกุลของท่าน"),
                ),
              new Node("RequesterEmail")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("อีเมลของผู้ที่ร้องขอ"),
                  new InputEmail("Text")
                    .PlaceholderText(
                      "กรอก E-mail ของท่าน เช่น johndoe@gmail.com",
                    ),
                ),
              new Node("RequesterDepartment")
                .Add(
                  new Label("Lb", "p")
                    .Bold()
                    .HorLeft()
                    .Text("แผนกของผู้ที่ร้องขอ"),
                  new DropDownMenu("Text")
                    .Options(
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
                        "แผนกห้องคลอดและทารกแรกเกิด",
                        "LRN - แผนกห้องคลอดและทารกแรกเกิด",
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
                      new DropDownOption("สำนักผู้อำนวยการโรงพยาบาล", "MAO - สำนักผู้อำนวยการโรงพยาบาล"),
                      new DropDownOption(
                        "ผู้อำนวยการโรงพยาบาล",
                        "ผู้อำนวยการโรงพยาบาล",
                      ),
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
                          new InputDatePicker("Text"),
                        ),
                      new Node("Time")
                        .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        .ExternalMargin(Px(0))
                        .Width(Percent(50))
                        .HorRight()
                        .Add(
                          new InputTime("Text"),
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
                          new InputDatePicker("Text"),
                        ),
                      new Node("Time")
                        .InternalMargin(Px(0), Px(0), Px(0), Px(10))
                        .ExternalMargin(Px(0))
                        .Width(Percent(50))
                        .HorRight()
                        .Add(
                          new InputTime("Text"),
                        ),
                    ),
                ),
              new Node("Submit")
                .Add(
                  new Button("Button")
                    .Text("ส่งคำร้องขอ")
                    .OnClick(async (node) => {
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
                      const res = await request({
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
                      });
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
});
