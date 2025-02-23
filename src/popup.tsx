import browser from "webextension-polyfill"

export default function Popup() {
    const openSidebar = async () => {
        try {
          const screenWidth = screen.availWidth
          const screenHeight = screen.availHeight
      
          const sidebarWidth = 400
          const sidebarHeight = 600
      
          // ウィンドウの50%以上が画面内に収まるように調整
          const left = Math.max(screenWidth - sidebarWidth, screenWidth / 2 - sidebarWidth / 2)
          const top = Math.max(100, screenHeight / 2 - sidebarHeight / 2)
      
          await chrome.windows.create({
            url: chrome.runtime.getURL("sidebar.html"),
            type: "popup",
            width: sidebarWidth,
            height: sidebarHeight,
            left,
            top
          })
        } catch (error) {
          console.error("Failed to open sidebar:", error)
        }
      }
      


    return (
        <div style={{ width: "200px", padding: "10px" }}>
            <h1>拡張機能</h1>
            <button onClick={openSidebar}>📂 サイドバーを開く</button>
        </div>
    )
}
