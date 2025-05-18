const IS_FIREFOX = typeof browser !== "undefined";
const IS_CHROME = typeof chrome !== "undefined";

const TIKTOK_URL_PATTERN = "https://www.tiktok.com/*";

/** The Chrome and Firefox types aren't identifical, but they are for `redirectUrl`. */
type BlockingResponse = Pick<
  browser.webRequest.BlockingResponse | chrome.webRequest.BlockingResponse,
  "redirectUrl"
>;

type OnBeforeRequestDetails =
  | browser.webRequest._OnBeforeRequestDetails
  | chrome.webRequest.WebRequestBodyDetails;

function onBeforeTikTokRequest(
  details: OnBeforeRequestDetails,
): BlockingResponse {
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
  const filter = { urls: [TIKTOK_URL_PATTERN] };

  if (IS_FIREFOX) {
    browser.webRequest.onBeforeRequest.addListener(
      onBeforeTikTokRequest,
      filter,
    );
  } else if (IS_CHROME) {
    chrome.webRequest.onBeforeRequest.addListener(
      onBeforeTikTokRequest,
      filter,
    );
  }
}

setup();
