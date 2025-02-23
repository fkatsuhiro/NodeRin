import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export default {
  manifest_version: 3,
  name: "My Sidebar Extension",
  version: "1.0",
  permissions: ["storage", "activeTab", "scripting"],
  background: { service_worker: "background.js" },
  action: { default_popup: "popup.html" },
  sidebar: { default_panel: "sidebar.html" }
}
