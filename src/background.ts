import browser from "webextension-polyfill"

browser.runtime.onInstalled.addListener(() => {
  console.log("拡張機能がインストールされました。")
})

browser.action.onClicked.addListener(async () => {
  await browser.sidebarAction.open()
})
