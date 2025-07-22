//@ts-check
import {
  Button,
  Container,
  Dandelion,
  getNodeById,
  InputText,
  Label,
  Node,
  Percent,
  Px,
  TextArea,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { createNotifyDialog } from "../module/dialog.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion((body) => {
  const params = new URLSearchParams(window.location.search);
  const requestUid = params.get("id");
  const approverToken = params.get("token");
  body.Title("ปฏิเสธการใช้รถส่วนกลาง")
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
              new Label("Lb", "h1")
                .Text("ปฏิเสธคำขอใช้รถ"),
              new Node("RequestId")
                .FlexContainer()
                .Add(
                  new Label("Lb", "p")
                    .Text("รหัสคำขอ"),
                  new InputText()
                    .InputValue(requestUid),
                ),
              new Node("Reasons")
                .Add(
                  new Label("Lb", "p")
                    .Text("เหตุผลที่ปฏิเสธการใช้รถ"),
                  new TextArea("#Reasons")
                    .LockSize(
                      Percent(100),
                      Px(200),
                    ),
                ),
              new Node("Submit")
                .Add(
                  new Button()
                    .Text("ส่งข้อความ")
                    .OnClick(async () => {
                      const progress = createNotifyDialog(
                        "⏳ กำลังส่งการปฏิเสธ . . .",
                      );
                      const res = await request({
                        method: "reject",
                        id: requestUid,
                        token: approverToken,
                        reasons: getNodeById("Reasons", TextArea).value,
                      });
                      if (progress.parent) {
                        progress.detach();
                      }
                      createNotifyDialog(
                        res.success
                          ? "✅ ส่งการปฏิเสธสำเร็จ"
                          : "❌ ผิดพลาด: " + res.error,
                      );
                    }),
                ),
            ),
        ),
    );
});
