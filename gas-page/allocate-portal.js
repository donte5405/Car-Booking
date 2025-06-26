//@ts-check
import {
  Button,
  Container,
  Dandelion,
  DialogBody,
  Label,
  Percent,
  Px,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";

const requestId = "";
const allocateToken = "";

UseDefaultTheme();

Dandelion((body) => {
  body
    .Title("ระบบขอใช้รถออนไลน์")
    .Add(
      new DialogBody("App")
        .FlexContainer()
        .HorCenter()
        .Add(
          new Container("Main")
            .OnSmallScreen((node) => node.Width(Percent(100)))
            .OnBigScreen((node) => node.Width(Px(640)))
            .Width(Px(240))
            .HorCenter()
            .Panel()
            .Add(
              new Label("LbTitle", "h1")
                .Text("ระบบขอใช้รถออนไลน์"),
              new Button()
                .Text("เริ่มจัดสรรการใช้รถ")
                .OnClick(() => {
                  window.top.location =
                    "https://pmdh-car.pages.dev/allocate.html?requestid=" +
                    requestId + "&token=" + allocateToken;
                }),
            ),
        ),
    );
});
