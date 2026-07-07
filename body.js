//@ts-check
import {
  $LeftSidebarBody,
  $TopNavigationBar,
  Button,
  Container,
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
import { checkVersion } from "./module/ver.js";

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
            new ImageFrame()
              .MaxHeight(Px(32))
              .Source(
                "",
              ),
            new Label("#Title").Text("ระบบจัดการการขอใช้รถยนต์ส่วนกลาง"),
          ) // Left
        )
        .Right((node) =>
          node.Id("TopNavRight").Add(
            new Label().Text(
              "Copyright " + String(new Date().getUTCFullYear()) +
                " Company Name",
            ),
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
            new Button()
              .OnClick(() => window.location.href = "../drivers")
              .Text("🧑‍💼 รายชื่อพลขับ"),
            new Button()
              .OnClick(() => window.location.href = "../request")
              .Text("📄 ออกคำร้องขอใหม่"),
            new Button()
              .OnClick(() => window.location.href = "../report")
              .Text("📄 ขอรายงานจากระบบ"),
          ) // TODO: Add sidebar menus.
          // Sidebar
        )
        .Root((node) => node.MinHeight(Vh(90)))
        .Body((node) =>
          node
            //.MaxWidth(Percent(100))
            .ContentClipping("auto")
            .Height(Percent(97))
            .Add(
              new Container("#Content")
                .Panel()
                .ContentClipping("auto")
                .HorCenter()
                .Add(
                  // TODO: Drop it here
                ), // AppContainer
            ) // Body
        )
        .$LeftSidebarBody,
    );

  // Check version update.
  checkVersion(true);

  return {
    title: getNodeById("Title", Label),
    content: getNodeById("Content", Node),
    sidebar: getNodeById("Sidebar", Node),
    topNavLeft: getNodeById("TopNavLeft", Node),
    topNavRight: getNodeById("TopNavRight", Node),
  };
}
