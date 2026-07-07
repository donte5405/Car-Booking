const res_unauthorised = { error: "unauthorised" };

function handleSession(sessionId = "", newSession = false) {
  const cache = CacheService.getScriptCache();
  const initSession = () => {
    sessionId = "session-" + Utilities.getUuid();
    cache.put(sessionId, true, 86400);
    return sessionId;
  };
  if (newSession) {
    return initSession();
  } else {
    if (cache.get(sessionId)) {
      return initSession();
    }
    return "";
  }
}

function authenticate(data, func) {
  if (!data.session) {
    return res_unauthorised;
  }
  const nextSession = handleSession(data.session);
  if (!nextSession) {
    return res_unauthorised;
  }
  const res = func(data);
  res.session = nextSession;
  return res;
}

function test_authenticate() {
  Logger.log(authenticate({
    session: "session-61a9ab72-ebd5-431e-8caa-db5251c624a3"
  }, () => {
    return {};
  }));
}

function dev_injectSession() {
  const cache = CacheService.getScriptCache();
  cache.put("session-61a9ab72-ebd5-431e-8caa-db5251c624a3", true);
}
