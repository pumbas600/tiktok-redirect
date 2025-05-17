const IS_FIREFOX = typeof browser !== "undefined";
const IS_CHROME = typeof chrome !== "undefined";

const TIKTOK_URL_PATTERN = "https://www.tiktok.com/*";

function onBeforeTikTokRequest(
  details: browser.webRequest._OnBeforeRequestDetails,
): browser.webRequest.BlockingResponse {
  if (details.method !== "GET") {
    return {};
  }

  const url = new URL(details.url);
  if (url.searchParams.size === 0) {
    return {};
  }

  /* Strip all the query parameters as this is what prevents you from playing videos in the browser. */
  const urlWithoutQueryParams = new URL(url.pathname, url.origin).toString();
  return { redirectUrl: urlWithoutQueryParams };
}

function setup() {
  browser.webRequest.onBeforeRequest.addListener(onBeforeTikTokRequest, {
    urls: [TIKTOK_URL_PATTERN],
  });
}

setup();
