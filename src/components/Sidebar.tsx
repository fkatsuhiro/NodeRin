import { useState, useEffect } from "react"
import browser from "webextension-polyfill"
import "../styles/sidebar.css"

export default function Sidebar() {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    const fetchTabs = async () => {
      const tabs = await browser.tabs.query({})
      setUrls(tabs.map(tab => tab.url || ""))
    }

    fetchTabs()
  }, [])

  return (
    <div className="sidebar">
      <h2>📂 URLリスト</h2>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul>
    </div>
  )
}
