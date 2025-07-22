//@ts-check
import {
  Button,
  Container,
  Dandelion,
  getNodeById,
  Label,
  List,
  ListItem,
  Node,
  Percent,
  Px,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { checkVersion } from "../module/ver.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  checkVersion(false);

  body
    .Title("ตารางการจองรถ")
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
                .Text("รายการจองรถ"),
              new Node("#Container")
                .HorLeft()
                .Add(
                  new Label("#Status")
                    .HorCenter()
                    .Text("⏳ กำลังโหลดข้อมูลตารางการจองรถ"),
                ),
              new Node("Back")
                .Add(
                  new Button()
                    .Text("ย้อนกลับ")
                    .OnClick(() => {
                      window.location.href = "../request";
                    }),
                ),
            ),
        ),
    );

  const container = getNodeById("Container", Node);
  const res = await request({
    method: "schedule",
  });

  if (!res.success) {
    getNodeById("Status", Label).Text("❌ ผิดพลาด: " + res.error);
    return;
  }

  container.Set();
  const cars = res.success;
  for (const key in cars) {
    const listContainer = new List();
    const requests = cars[key];
    for (const request of requests) {
      listContainer.Add(new ListItem().Add(request));
    }
    container.Add(
      new Label().Bold().Text("🚗 " + key),
      listContainer,
    );
  }
});
