const browserAPI = typeof browser !== "undefined" ? browser : chrome;

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCookies") {
        const url = request.url;
        browserAPI.cookies.getAll({ url }, (cookies) => {
            sendResponse({ cookies });
        });
        return true;
    }
});
