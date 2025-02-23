import browser from "webextension-polyfill"

console.log("Content script loaded")

// 右クリックでサイドバーを開く例
document.addEventListener("contextmenu", async () => {
  await browser.sidebarAction.open()
})
