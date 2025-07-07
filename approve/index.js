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
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  body.Title("อนุมัติคำขอใช้รถส่วนกลาง")
    .Add(
      new DialogBody("App")
        .Dim()
        .Add(
          new Container("#Main")
            .OnSmallScreen((node) => node.MaxWidth(Percent(100)))
            .OnBigScreen((node) => node.MaxWidth(Px(640)))
            .Panel()
            .Add(
              new Label("#LbProgressFirst", "h1")
                .Text("⏳ กำลังอนุมัติคำขอใช้รถยนต์ส่วนกลาง..."),
              new Label("#LbProgressSecond", "h4")
                .Text("อย่าปิดหน้าต่างนี้จนกว่าการอนุมัติจะเสร็จสิ้น"),
            ),
        ),
    );
  const params = new URLSearchParams(window.location.search);
  const res = await request({
    method: "approve",
    id: params.get("id"),
    token: params.get("token"),
  });
  const lbProgress = getNodeById("LbProgressFirst", Label);
  const lbSecond = getNodeById("LbProgressSecond", Label);
  const main = getNodeById("Main", Container);
  lbProgress.Text(
    res.success ? "✅ อนุมัติคำขอเรียบร้อยแล้ว" : "❌ ผิดพลาด: " + res.error,
  );
  lbSecond.Text(
    res.success ? "คุณสามารถปิดหน้าต่างนี้ได้" : "โปรดติดต่อเจ้าหน้าที่ IT",
  );
  main.Add(
    new Button()
      .Text("ปิดหน้าต่างนี้")
      .OnClick(() => window.close()),
  );
});
