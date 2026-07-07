function post_auth(data) {
  const token = data.token;
  const [porterName, porterEmail, storedToken] = getConfig("PorterName", "PorterEmail", "PorterToken");

  if (storedToken !== token) {
    return { "error": "invalid-token" };
  }
  
  const newToken = Utilities.getUuid();
  const emailContent = renderTemplatePage("Mails/AuthLink", {
    porterName: porterName,
    authUrl: `${getFrontendUrl(data.debug)}/auth/?token=${newToken}`,
  }).getContent();

  if (!data.debug) {
    setConfig({ PorterToken: newToken });
  }

  sendEmail({
    to: porterEmail,
    subject: "[Car Booking] อีเมลสำหรับเข้าสู่ระบบครั้งถัดไป ของวันที่ " + formatThaiDate(new Date()),
    htmlBody: emailContent,
  }, data);

  return {
    success: newToken,
    session: handleSession("", true),
  };
}

function test_auth() {
  Logger.log(post_auth({
    debug: true,
    token: "abc@1234",
  }));
}
