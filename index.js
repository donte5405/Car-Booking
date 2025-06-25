//@ts-check
import {
  Container,
  Dandelion,
  DropDownMenu,
  DropDownOption,
  InputEmail,
  InputText,
  Label,
  Node,
  Percent,
  Px,
  TextArea,
} from "./dandelion/dandelion.js";
import { UseDefaultTheme } from "./dandelion/default.css.js";

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
                    ._HorLeft()
                    ._Text("ชื่อผู้ที่ร้องขอ"),
                  new InputText("Text")
                    ._PlaceholderText("กรอกชื่อ - นามสกุลของท่าน"),
                ),
              new Node("RequesterEmail")
                ._Add(
                  new Label("Lb", "p")
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
                    ._Html(HTMLElement, (html) => html.innerHTML = "<b>เหตุผลที่ขอใช้รถ</b>"),
                  new TextArea("Text")
                    ._LockWidth(Percent(100))
                    ._MinHeight(Px(200)),
                ),
            ),
        ),
    );
});
