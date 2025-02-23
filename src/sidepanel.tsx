import AddFormInFolder from "./components/addFormInFolder"
import AddNewFolder from "./components/addNewFolder"
import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import "bootstrap/dist/css/bootstrap.min.css";
import deleteIcon from './assets/deleteIcon.png';
import plusIcon from './assets/plusIcon.png';

type Data = {
  title: string
  url: string
  favIconUrl?: string
}

function IndexSidePanel() {
  const [items, setItems] = useStorage<Data[]>("saveItems", []);
  const deleteIcon = require('./assetts/deleteIcon.png');
  const [data, setData] = useState("")
  const [showTab, setShowTab] = useState(false)

  const [currentPage, setCurrentPage] = useState<Data>({
    title: "",
    url: "",
    favIconUrl: ""
  })

  const handleButtonClick = () => {
    setShowTab(true)
  }

  const handleCloseTab = () => {
    setShowTab(false)
  }

  // 現在のタブ情報を取得
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab) return

      setCurrentPage({
        title: activeTab.title || "No title",
        url: activeTab.url || "No url",
        favIconUrl: activeTab.favIconUrl || ""
      })
    })
  }, [])

  // URL を保存する関数
  const saveCurrentPage = () => {
    if (!currentPage.url) return
    //このページがすでに保存されているか確認
    if (items.some((item) => item.url === currentPage.url)) {
      alert("This Page is already saved!!")
      return
    }

    // 新しいデータを追加
    setItems([...items, currentPage])
  }

  // 削除処理
  const removeItem = (url: string) => {
    setItems(items.filter((item) => item.url !== url))
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>You can save some URLs!!</h2>
      <AddNewFolder />

      <button className="button" onClick={handleButtonClick}>
        Add
      </button>
      {showTab && <AddFormInFolder onClose={handleCloseTab} />}
      {/* 保存された URL のリスト */}
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: 8 }}>
            <img
              src={item.favIconUrl}
              alt="favicon"
              style={{ width: 16, height: 16, marginRight: 8 }}
            />
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <img onClick={() => removeItem(item.url)} alt="delete" src={deleteIcon} style={{width:'20px', height: '20px', pointer: 'cursor'}} />
          </li>
        ))}
      </ul>
      {/* 現在のページを保存するボタン */}
      <img onClick={saveCurrentPage} alt="delete" src={plusIcon} style={{width:'40px', height: '40px', pointer: 'cursor'}} />
    </div>
  )
}

export default IndexSidePanel