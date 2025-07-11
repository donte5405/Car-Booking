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
import { createNotifyDialog } from "./module/dialog.js";

/**
 * Manages daily date checking using localStorage.
 * This function checks if the current date is different from the last saved date.
 * If it's a new day, it updates the saved date in localStorage.
 * It can also optionally reset the saved date.
 *
 * @param {boolean} [reset=false] - If true, the saved date in localStorage will be cleared before checking.
 * @returns {boolean} True if today's date is different from the last saved date (or if no date was saved), false otherwise.
 */
function isNewDate(reset = false) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  let lastVisitedDate = localStorage.getItem("lastVisitedDate");
  let isNewDay = false;

  // If reset is true, clear the stored date
  if (reset) {
    localStorage.removeItem("lastVisitedDate");
    lastVisitedDate = null; // Ensure lastVisitedDate reflects the reset state
    console.log("Saved date has been reset!");
  }

  if (lastVisitedDate) {
    // If a date was previously saved, compare it with today's date
    if (lastVisitedDate === todayDate) {
      isNewDay = false; // Same day
    } else {
      isNewDay = true; // Different day
      // Update the saved date to today's date
      localStorage.setItem("lastVisitedDate", todayDate);
    }
  } else {
    // If no date was saved, this is the first visit or localStorage was cleared
    isNewDay = true;
    // Save today's date
    localStorage.setItem("lastVisitedDate", todayDate);
  }

  return isNewDay;
}

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
              .Source("https://website-storage.princhealth.com/pmdh/settings/20241211133602-pmdh-weblogo-01.png"),
            new Label("#Title").Text("ระบบจัดการการขอใช้รถยนต์ส่วนกลาง"),
          ) // Left
        )
        .Right((node) =>
          node.Id("TopNavRight").Add(
            new Label().Text(
              "Copyright " + String(new Date().getUTCFullYear()) +
                " Principal Healthcare - Mukdahan, Co., Ltd.",
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
              .OnClick(() => window.location.href = "../request")
              .Text("📄 ออกคำร้องขอใหม่"),
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

  // Check version update.
  const checkVer = async () => {
    if (window.location.href.indexOf("https://") === 0) {
      if (isNewDate()) {
        createNotifyDialog("กำลัง Refresh ไป version ใหม่ . . .");
        const res = await fetch("https://pmdh-car.pages.dev/");
        const version = (await res.text()).split("__________")[1];
        window.location.href = "../../build-" + version + "/requests";
      }
    }
  };
  checkVer();

  return {
    title: getNodeById("Title", Label),
    content: getNodeById("Content", Node),
    sidebar: getNodeById("Sidebar", Node),
    topNavLeft: getNodeById("TopNavLeft", Node),
    topNavRight: getNodeById("TopNavRight", Node),
  };
}
