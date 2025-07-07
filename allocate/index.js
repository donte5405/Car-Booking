//@ts-check
import { buildBody } from "../body.js";
import {
  Button,
  Container,
  Dandelion,
  DialogBody,
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

function generateCarText(car) {
  return "🚗 " + car.licenseId + " " + car.name + " (เลขไมล์ปัจจุบัน " +
    String(car.mileage) + ")";
}

Dandelion(async (body) => {
  const { title, sidebar, topNavLeft, topNavRight, content } = buildBody(body);
  sidebar.Add(
    new Button()
      .Text("⬅️ ย้อนกลับ")
      .OnClick(() => {
        window.location.href = "../requests";
      }),
  );
  title.Text("จัดสรรการใช้รถ");
  content.Add(
    new Label("LbLoading", "p")
      .Text("⏳ กำลังโหลดรายการคำร้องขอ..."),
  );

  // Load request data.
  let requestData;
  const params = new URLSearchParams(window.location.search);
  const requestUid = params.get("id");
  const requestDataRaw = window.sessionStorage.getItem("requestData");
  if (requestDataRaw) {
    requestData = JSON.parse(requestDataRaw);
  } else if (!requestUid) {
    createNotifyDialog(
      "❌ ไม่พบข้อมูล อาจเกิดจากล็อกอินหมดอายุ หรือลิงก์ที่ท่านได้รับมาจากอีเมลไม่ถูกต้อง",
    );
    return;
  } else {
    const res = await request({
      method: "requestdata",
      requestid: requestUid,
    });
    if (!res.success) {
      createNotifyDialog("❌ ผิดพลาด: " + res.error);
      return;
    }
    requestData = res.success;
  }

  // Load car data (async)
  let selectedCarData = {
    id: requestData.car,
  };
  const loadCar = async () => {
    const res = await request({
      method: "cars",
    });

    if (!res.success) {
      createNotifyDialog(
        "❌ โหลดข้อมูลรถผิดพลาด: " + res.error,
      );
      getNodeById("SelectCarButton").Text("❌ โหลดข้อมูลผิดพลาด");
      getNodeById("LbCarLoadStatus", Label).Text("❌ โหลดข้อมูลรถล้มเหลว");
      return;
    }

    if (!requestData.car) {
      getNodeById("SelectCarButton").Text("🚗 คลิกเพื่อเลือกรถ . . .");
    }

    const carListContainer = getNodeById("CarList", Node);
    carListContainer.Set();
    for (const car of res.success.available) {
      const carText = generateCarText(car);
      carListContainer.Add(
        new Button()
          .OnClick(() => {
            selectedCarData = car;
            getNodeById("SelectCar", Node).hide();
            getNodeById("SelectCarButton", Button).Text(carText);
            getNodeById("MileageStart", InputText).InputValue(String(car.mileage));
          })
          .Text(carText),
      );
      // Load selected car data.
      if (requestData.car === car.id) {
        selectedCarData = car;
        getNodeById("SelectCarButton").Text(carText);
      }
    }
    for (const car of res.success.unavailable) {
      const carText = generateCarText(car);
      carListContainer.Add(
        new Button()
          .Enabled(false)
          .Text(carText),
      );
      // Load selected car data.
      if (requestData.car === car.id) {
        selectedCarData = car;
        getNodeById("SelectCarButton").Text(carText);
      }
    }
  };
  loadCar();

  // Render data.
  content.Set(
    new Label("LbTitle", "h1")
      .Text("ระบบขอใช้รถออนไลน์"),
    new Node("Container")
      .InternalMargin(Px(16))
      .Add(
        new Node()
          .FlexContainer()
          .ExternalMargin(Px(0))
          .OnBigScreen((node) => node.FlexDirection("row"))
          .OnSmallScreen((node) => node.FlexDirection("column"))
          .FlexWrap("wrap")
          .FlexDirection("row")
          .Add(
            new Node("RequesterName")
              .MinWidth(Percent(30))
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ชื่อผู้ที่ร้องขอ"),
                new Label("Lb2", "p")
                  .HorLeft()
                  .Text(requestData.name),
              ),
            new Node("RequestDuration")
              .MinWidth(Percent(30))
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ระยะเวลาที่ต้องใช้รถ"),
                new Node()
                  .FlexContainer()
                  .FlexWrap("wrap")
                  .Add(
                    new Label().ExternalMargin(Px(0)).Text(requestData.from),
                    "–",
                    new Label().ExternalMargin(Px(0)).Text(requestData.to),
                  ),
              ),
            new Node("RequestParticipants")
              .MinWidth(Percent(30))
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ผู้ที่ร่วมเดินทางไปด้วย"),
                new Label("Lb2", "p")
                  .HorLeft()
                  .Text(requestData.participants),
              ),
            new Node("RequestReasons")
              .MinWidth(Percent(30))
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("เหตุผลที่ต้องใช้รถ"),
                new Label("Lb2", "p")
                  .HorLeft()
                  .Text(requestData.reasons),
              ),
          ),
        new Node("RequestCar")
          .MinWidth(Percent(47))
          .HorLeft()
          .Add(
            new Label("Lb", "p")
              .Bold()
              .HorLeft()
              .Text("รถยนต์ส่วนกลางที่จอง"),
            new Button("#SelectCarButton")
              .OnClick(() => getNodeById("SelectCar", Node).show())
              .Text("กำลังโหลด . . ."),
          ),
        new Node("RequestDetails")
          .HorCenter()
          .FlexContainer()
          .ExternalMargin(Px(0))
          .OnBigScreen((node) => node.FlexDirection("row"))
          .OnSmallScreen((node) => node.FlexDirection("column"))
          .FlexWrap("wrap")
          .FlexDirection("row")
          .Add(
            new Node("RequestMileageStart")
              .MinWidth(Percent(47))
              .HorLeft()
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ลงเลขไมล์เริ่มต้น"),
                new InputText("#MileageStart")
                  .Stretch()
                  .AutocompleteEnabled()
                  .InputValue(requestData.mileageStart),
              ),
            new Node("RequestMileageEnd")
              .MinWidth(Percent(47))
              .HorLeft()
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ลงเลขไมล์สุดท้าย (เฉพาะเมื่อใช้งานรถเสร็จสิ้น)"),
                new InputText("#MileageEnd")
                  .Stretch()
                  .AutocompleteEnabled()
                  .InputValue(requestData.mileageEnd),
              ),
            new Node("RequestDriver")
              .MinWidth(Percent(47))
              .HorLeft()
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ลงชื่อพลขับ (คนขับรถ)"),
                new InputText("#Driver")
                  .Stretch()
                  .AutocompleteEnabled()
                  .InputValue(requestData.driver),
              ),
            new Node("RequestAllocator")
              .MinWidth(Percent(47))
              .HorLeft()
              .Add(
                new Label("Lb", "p")
                  .Bold()
                  .HorLeft()
                  .Text("ลงชื่อผู้ดำเนินการ"),
                new InputText("#Allocator")
                  .Stretch()
                  .AutocompleteEnabled()
                  .InputValue(requestData.allocator),
              ),
          ),
        new Button("SubmitButton")
          .OnClick(async () => {
            // Check data
            const body = {
              method: "allocate",
              id: requestData.id,
              carId: selectedCarData.id,
              driver: getNodeById("Driver", InputText).value,
              allocator: getNodeById("Allocator", InputText).value,
              mileageStart: getNodeById("MileageStart", InputText).value,
              mileageEnd: getNodeById("MileageEnd", InputText).value,
            };

            if (!body.id.trim()) {
              createNotifyDialog(
                "❌ เลขที่ UID คำร้องขอไม่ถูกต้อง ลองเข้าเมนูรายการคำขอแล้วลองอีกครั้ง"
              );
              return;
            }
            if (!body.carId.trim()) {
              createNotifyDialog(
                "❌ คุณยังไม่ได้เลือกรถ ดำเนินการต่อไม่ได้"
              );
              return;
            }
            if (!body.driver.trim()) {
              createNotifyDialog(
                "❌ ยังไม่ได้ลงชื่อพลขับ"
              );
              return;
            }
            if (!body.allocator.trim()) {
              createNotifyDialog(
                "❌ ยังไม่ได้ลงชื่อผู้จัดสรรรถ"
              );
              return;
            }
            if (!body.mileageStart.trim()) {
              createNotifyDialog(
                "❌ ต้องระบุเลขไมล์เริ่มต้น"
              );
              return;
            }
            const mileageNumStart = Number(body.mileageStart.trim());
            const mileageNumEnd = Number(body.mileageEnd.trim());
            console.log(selectedCarData);
            const carMileageNum = selectedCarData.mileage;
            if (isNaN(mileageNumStart)) {
              createNotifyDialog(
                "❌ เลขไมล์ต้องเป็นตัวเลข",
              );
              return;
            }
            if (isNaN(carMileageNum)) {
              createNotifyDialog(
                "❌ รอข้อมูลรถโหลดเสร็จก่อน"
              );
              return;
            }
            if (mileageNumStart < carMileageNum) {
              createNotifyDialog(
                "❌ เลขไมล์ห้ามต่ำกว่าที่เคยบันทึกไว้"
              );
              return;
            }
            if (mileageNumEnd) {
              if (mileageNumEnd < carMileageNum) {
                createNotifyDialog(
                  "❌ เลขไมล์เมื่อใช้งานรถเสร็จสิ้น ห้ามต่ำกว่าที่เคยบันทึกไว้"
                );
                return;
              }
            }

            // Submit request.
            const progress = createNotifyDialog(
              "⏳ กำลังยืนยันการจองรถ . . ."
            );
            const res = await request(body);

            if (progress.parent) {
              progress.detach();
            }

            if (!res.success) {
              createNotifyDialog("❌ ผิดพลาด: " + res.error);
              return;
            }

            createNotifyDialog("✅ ดำเนินการเรียบร้อยแล้ว", () => {
              // Return to request list screen.
              window.location.href = "../requests";
            });
          })
          .Text("ยืนยันการจัดสรรรถ")
      ),
    new DialogBody("#SelectCar")
      .Hidden()
      .Dim()
      .Add(
        new Container()
          .Panel()
          .FlexContainer()
          .FlexDirection("column")
          .FlexWrap("wrap")
          .Width(Px(1024))
          .Height(Px(576))
          .Add(
            new Label("Lb", "h2")
              .Text("เลือกรถยนต์ส่วนกลางที่ต้องการจัดสรร"),
            new Node("#CarList")
              .ContentClipping("auto")
              .FlexContainer()
              .FlexDirection("column")
              .Stretch()
              .HorLeft()
              .Add(
                new Label("#LbCarLoadStatus", "p")
                  .Text("⏳ กำลังโหลดรายการรถ รอสักครู่..."),
              ),
            new Node()
              .Add(
                new Button()
                  .MinWidth(Px(128))
                  .OnClick(() => getNodeById("SelectCar", Node).hide())
                  .Text("ยกเลิก"),
              ),
          ),
      ),
  );
});
