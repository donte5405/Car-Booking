//@ts-check
import { calc } from "./dandelion/dandelion.css.js";
import {
  $LeftSidebarBody,
  $TopNavigationBar,
  Button,
  Container,
  Dandelion,
  Em,
  getNodeById,
  ImageFrame,
  Label,
  Node,
  Percent,
  Px,
  Vh,
  ViewportHeight,
} from "./dandelion/dandelion.js";
import { UseDefaultTheme } from "./dandelion/default.css.js";

/**
 * @param {import("./dandelion/dandelion.js").BodyNode} body
 */
export function buildBody(body) {
  UseDefaultTheme();
  body.Title("ระบบจัดการการขอใช้รถยนต์ส่วนกลาง")
    .Height(ViewportHeight(100))
    .Add(
      new $TopNavigationBar("TopNav")
        .Left((node) =>
          node.Id("TopNavLeft").Add(
            new Label("#Title").Text("ระบบจัดการการขอใช้รถยนต์ส่วนกลาง"),
          ) // Left
        )
        .Right((node) =>
          node.Id("TopNavRight").Add(
            new Label().Text("Copyright " + String(new Date().getUTCFullYear()) + " Principal Healthcare - Mukdahan, Co., Ltd."),
          ) // Right
        )
        .$TopNavigationBar,
      new $LeftSidebarBody("Application")
        .Size(Px(256))
        .Sidebar((node) =>
          node.Id("Sidebar").Add(
            new Button()
              .OnClick(() => window.location.href = "../requests")
              .Text("📜 รายการคำขอทั้งหมด"),
            new Button()
              .OnClick(() => window.location.href = "../cars")
              .Text("🚗 รายการรถทั้งหมด"),
          ) // TODO: Add sidebar menus.
          // Sidebar
        )
        .Root((node) => node.MinHeight(Vh(90)))
        .Body((node) =>
          node
            //.MaxWidth(Percent(100))
            .ContentClipping("auto")
            .Add(
              new Container("#Content")
                .Panel()
                .ContentClipping("auto")
                .Height(Percent(97))
                .HorCenter()
                .Add(
                  // TODO: Drop it here
                ), // AppContainer
            ) // Body
        )
        .$LeftSidebarBody,
    );
  return {
    title: getNodeById("Title", Label),
    content: getNodeById("Content", Node),
    sidebar: getNodeById("Sidebar", Node),
    topNavLeft: getNodeById("TopNavLeft", Node),
    topNavRight: getNodeById("TopNavRight", Node),
  };
}
