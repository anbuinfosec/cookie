document.getElementById("getCookies").addEventListener("click", async () => {
  const format = document.getElementById("format").value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.runtime.sendMessage(
    { action: "getCookies", url: tab.url },
    (response) => {
      const cookies = response.cookies || [];
      let display = "";

      if (format === "json") {
        display = JSON.stringify(cookies, null, 2);
      } else if (format === "text") {
        display = cookies.map(cookie => `${cookie.name}: ${cookie.value}`).join("\n");
      }

      const cookiesElement = document.getElementById("cookies");
      cookiesElement.textContent = display || "No cookies found.";
      cookiesElement.classList.remove("hidden");
      document.getElementById("actions").classList.remove("hidden");

      if (format === "json") {
        document.getElementById("copyCookies").classList.remove("hidden");
        document.getElementById("exportAsJSON").classList.remove("hidden");
        document.getElementById("exportAsText").classList.add("hidden");
      } else if (format === "text") {
        document.getElementById("copyCookies").classList.remove("hidden");
        document.getElementById("exportAsText").classList.remove("hidden");
        document.getElementById("exportAsJSON").classList.add("hidden");
      }
    }
  );
});


document.getElementById("copyCookies").addEventListener("click", () => {
  const cookies = document.getElementById("cookies").textContent;
  navigator.clipboard.writeText(cookies).then(() => {
    alert("Cookies copied to clipboard!");
  }).catch(err => {
    alert("Failed to copy cookies: " + err);
  });
});


document.getElementById("exportAsText").addEventListener("click", () => {
  const cookies = document.getElementById("cookies").textContent;
  const blob = new Blob([cookies], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cookies.txt";
  a.click();
  URL.revokeObjectURL(url);
});


document.getElementById("exportAsJSON").addEventListener("click", async () => {
  const cookies = JSON.parse(document.getElementById("cookies").textContent);
  const blob = new Blob([JSON.stringify(cookies, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cookies.json";
  a.click();
  URL.revokeObjectURL(url);
});
