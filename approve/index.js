import {
  Button,
  Container,
  Dandelion,
  DialogBody,
  getNodeById,
  Label,
  Node,
  Px,
} from "../dandelion/dandelion.js";
import { request } from "../module/google.js";

Dandelion(async (body) => {
  body.Title("อนุมัติคำขอใช้รถส่วนกลาง")
    .Add(
      new DialogBody("App")
        .Add(
          new Container("#Main")
            .OnSmallScreen((node) =>
              node.MaxWidth(Percent(100))
                .OnBigScreen((node) => node.MaxWidth(Px(640)))
                .Add(
                  new Label("#Progress", "h1")
                    .Text("⏳ กำลังอนุมัติคำขอใช้รถยนต์ส่วนกลาง..."),
                )
            ),
        ),
    );
  const params = new URLSearchParams(window.location.search);
  const lbProgress = getNodeById("Progress", Label);
  const main = getNodeById("Main", Container);
  const res = await request({
    method: "approve",
    id: params.get("id"),
    token: params.get("token"),
  });
  lbProgress.Text(
    res.success ?
      "✅ อนุมัติคำขอเรียบร้อยแล้ว" :
      "❌ ผิดพลาด: " + res.error,
  );
  main.Add(
    new Button()
      .Text("ปิดหน้าต่างนี้")
      .OnClick(() => window.close()),
  );
});
