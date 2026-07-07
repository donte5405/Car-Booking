const appVersion = "build-number";
const debugEmail = "example@gmail.com";
const frontendDebugUrl = "http://localhost:8080";
const frontendUrl = "https://app.pages.dev/" + appVersion;
const sheetId = "GOOGLE_SHEET_APP_ID";

const companyName = "Company Name";
const adminEmailAddress = "it@gmail.com";
const itHodEmailAddress = "ithod@gmail.com";

/** Get front-end URL. */
function getFrontendUrl(isDebug = false) {
  return isDebug ? frontendDebugUrl : frontendUrl;
}
