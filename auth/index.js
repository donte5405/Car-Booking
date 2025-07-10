//@ts-check
import {
  Container,
  Dandelion,
  DialogBody,
  getNodeById,
  Label,
  Node,
  Percent,
  Px,
} from "../dandelion/dandelion.js";
import { UseDefaultTheme } from "../dandelion/default.css.js";
import { request } from "../module/google.js";

UseDefaultTheme();

Dandelion(async (body) => {
  body.Title("เข้าสู่ระบบจัดการขอใช้รถส่วนกลาง")
    .Add(
      new DialogBody("Main")
        .Dim()
        .Add(
          new Container("Window")
            .FlexContainer()
            .FlexDirection("column")
            .Size(Px(320), Px(280))
            .MaxSize(Percent(100), Percent(100))
            .Panel()
            .Add(
              new Node()
                .Size(Percent(100))
                .FlexContainer()
                .VerCenter()
                .Add(
                  new Label("#Status")
                    .Stretch()
                    .Text("⏳ กำลังเข้าสู่ระบบ..."),
                ),
            ),
        ),
    );
  const params = new URLSearchParams(window.location.search);
  const res = await request({
    method: "auth",
    token: params.get("token") || window.localStorage.getItem("token") || undefined,
  });
  console.log(res);
  if (res.success) {
    window.localStorage.setItem("token", res.success);
    window.sessionStorage.setItem("session", res.session);
    window.location.href = "../requests/";
  } else {
    getNodeById("Status", Label).Text("❌ เข้าสู่ระบบล้มเหลว โปรดเข้าสู่ระบบจาก Email");
  }
});
