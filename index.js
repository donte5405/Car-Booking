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
                    ._PlaceholderText("กรอกชื่อ - นามสกุลของท่าน")
                ),
              new Node("RequesterEmail")
                ._Add(
                  new Label("Lb", "p")
                    ._HorLeft()
                    ._Text("อีเมลของผู้ที่ร้องขอ"),
                  new InputEmail("Text")
                    ._PlaceholderText("กรอก E-mail ของท่าน เช่น johndoe@gmail.com"), 
                ),
              new Node("RequesterDepartment")
                ._Add(
                  new Label("Lb", "p")
                    ._HorLeft()
                    ._Text("แผนกของผู้ที่ร้องขอ"),
                  new DropDownMenu("Text")
                    ._Class("dandelion-inputtext")
                    ._Options(
                      new DropDownOption("erd", "ERD - แผนกห้องฉุกเฉิน"),
                    ),
                ),
            ),
        ),
    );
});
