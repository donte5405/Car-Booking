//@ts-check
import { createNotifyDialog } from "./dialog.js";

/**
 * @param {boolean} isPorter 
 */
export function checkVersion(isPorter) {
    if (window.location.href.indexOf("https://") === 0) {
        // Check version update.
        const checkVer = async () => {
            const res = await fetch("https://" + window.location.hostname);
            const current = window.localStorage.getItem("currentVersion");
            const version = (await res.text()).split("__________")[1];
            window.localStorage.setItem("currentVersion", version);
            if (!current) {
                console.log("Freshly new session, no need to check.");
                return;
            }
            if (current != version) {
                createNotifyDialog("กำลังอัปเดตไปเวอร์ชันใหม่ . . .");
                window.location.href = "../../build-" + version + "/" + (isPorter ? "?target=porter" : "");
            }
        };
        setTimeout(checkVer, 1000);
        setInterval(checkVer, 30000);
    }
}
