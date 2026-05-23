const TOKEN_KEY = "novawear_access_token";

const canUseStorage = () => typeof window !== "undefined";

export function getAccessToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function hasAccessToken() {
  return Boolean(getAccessToken());
}
