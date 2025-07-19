//@ts-check
import { createNotifyDialog } from "./dialog.js";

export function checkVersion() {
    if (window.location.href.indexOf("https://") === 0) {
        // Check version update.
        const checkVer = async () => {
            const res = await fetch("https://" + window.location.hostname);
            const version = (await res.text()).split("__________")[1];
            const current = window.localStorage.getItem("currentVersion");
            if (current != version) {
                createNotifyDialog("กำลังอัปเดตไปเวอร์ชันใหม่ . . .");
                window.localStorage.setItem("currentVersion", version);
                window.location.href = "../../build-" + version + "/requests";
            }
        };
        setTimeout(checkVer, 1000);
        setInterval(checkVer, 30000);
    }
}
