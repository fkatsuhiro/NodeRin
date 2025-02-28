import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import AddNewFolder from "./components/addNewFolder";
import UrlRelevance from "./components/UrlRelevance";
import deleteIcon from './assets/deleteIcon.png';
import newfolderIcon from './assets/newfolderIcon.png';
import plusIcon from './assets/plusIcon.png';
import exportIcon from './assets/exportIcon.png';
import openIcon from './assets/openIcon.png';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/style.css';
import { getCurrentJSTTime } from "./utils/dateUtils";
import type { Folder, Data } from "./lib/storage";

/* Time Stampの調整 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const formattedDate = date.toLocaleDateString(undefined, options);
  const year = date.getFullYear();
  return `${year}年 ${formattedDate}`;
}

function SidePanel() {
  const [folders, setFolders] = useStorage<Folder[]>("folders", []);
  const [currentPage, setCurrentPage] = useState<Data>({
    title: "",
    url: "",
    addDataTime: "",
  });
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [initialFolderName, setInitialFolderName] = useState<string | null>(null);

  // 現在のタブ情報を取得
  const updateCurrentPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;

      setCurrentPage({
        title: activeTab.title || "There are no title",
        url: activeTab.url || "There are no url",
        addDataTime: getCurrentJSTTime(),
      });
    });
  };

  useEffect(() => {
    updateCurrentPage();

    // タブがアクティブになったときのイベントリスナー
    chrome.tabs.onActivated.addListener(updateCurrentPage);

    // タブが更新されたときのイベントリスナー
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete") {
        updateCurrentPage();
      }
    });

    // クリーンアップ
    return () => {
      chrome.tabs.onActivated.removeListener(updateCurrentPage);
      chrome.tabs.onUpdated.removeListener(updateCurrentPage);
    };
  }, []);

  const handleAddFolder = (folderName: string, note: string) => {
    const newFolder: Folder = {
      name: folderName,
      note: note,
      updateTime: getCurrentJSTTime(),
      items: [{ ...currentPage, note, addDataTime: getCurrentJSTTime() }], 
    };
    setFolders([...folders, newFolder]);
  };

  const handleAddItemToFolder = (folderName: string, note: string) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.name === folderName) {
        return {
          ...folder,
          updateTime: getCurrentJSTTime(),
          items: [...folder.items, { ...currentPage, note, addDataTime: getCurrentJSTTime() }]
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  const handleExportSpreadSheet = (folderIndex: number) => {
    const folder = folders[folderIndex];
    const csvHeader = "Folder title, URL title, URL, URL detail, Time Stamp \n";
    const csvData = folder.items.map((item) => {
      return `${folder.name},${item.title},${item.url},${item.note},${item.addDataTime}`;
    }).join("\n");

    const csvContent = "\uFEFF" + csvHeader + csvData;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${folder.name}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const removeItem = (folderIndex: number, itemIndex: number) => {
    const updatedFolders = folders.map((folder, i) => {
      if (i === folderIndex) {
        const updatedItems = folder.items.filter((_, index) => index !== itemIndex);
        if (updatedItems.length === 0) {
          return null; 
        }
        return {
          ...folder,
          updateTime: getCurrentJSTTime(),
          items: updatedItems
        };
      }
      return folder;
    }).filter(folder => folder !== null);

    setFolders(updatedFolders);
  };

  /* フォルダの削除 */
  const removeFolder = (folderIndex: number) => {
    const updatedFolders = folders.filter((_, i) => i !== folderIndex);
    setFolders(updatedFolders);
  };

  /* フォルダ内の全てのURLを開く */
  const openAllUrlsInFolder = (folderIndex: number) => {
    const folder = folders[folderIndex];
    folder.items.forEach(item => {
      window.open(item.url, '_blank');
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <div className="d-flex">
      <img
        onClick={() => {
          setInitialFolderName(null);
          setShowAddFolder(true);
        }}
        alt="add"
        src={newfolderIcon}
        style={{ width: "30px", height: "30px", cursor: "pointer" }}
      />
      <h3 className="mx-auto">Nodeりん</h3>
      </div>
      <hr />
      <div className="scrollable-content">
      {showAddFolder && (
        <div className="overlay">
          <AddNewFolder
            onAddFolder={initialFolderName ? handleAddItemToFolder : handleAddFolder}
            onClose={() => setShowAddFolder(false)}
            currentPage={currentPage}
            initialFolderName={initialFolderName || ""}
          />
        </div>
      )}
      <ul className="mt-3">
        {folders.map((folder, folderIndex) => (
          <li key={folderIndex} style={{ marginBottom: 8, listStyle: "none" }}>
            <details>
              <summary style={{ width: "100%" }}>
                {folder.name} &nbsp;
                <span className="badge bg-secondary rounded-pill">{folder.items.length}</span>
                <img
                  onClick={() => {
                    setInitialFolderName(folder.name);
                    setShowAddFolder(true);
                  }}
                  alt="add"
                  src={plusIcon}
                  style={{ width: "30px", height: "30px", cursor: "pointer"}}
                  className="ms-auto"
                />
                <img
                  onClick={() => {
                    openAllUrlsInFolder(folderIndex);
                  }}
                  alt="open"
                  src={openIcon}
                  style={{ width: "30px", height: "30px", cursor: "pointer" }}
                  className="ms-auto"
                />
                <img
                  onClick={() => {
                    handleExportSpreadSheet(folderIndex);
                  }}
                  alt="spreadsheet"
                  src={exportIcon}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  className="ms-auto"
                />
                <img
                  onClick={() => {
                    removeFolder(folderIndex);
                  }}
                  alt="delete"
                  src={deleteIcon}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  className="ms-auto"
                />
                <p className="ms-auto" style={{color: "gray", fontSize: "small"}}> &nbsp; &nbsp; &nbsp; &nbsp; {formatDate(folder.updateTime)}</p>
              </summary>
              <ul style={{ listStyle: "none", width: "100%" }}>
                {folder.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: 8 }} className="mt-2">
                    <div className="d-flex">
                    <div>
                      <UrlRelevance initialTime={folder.items[0].addDataTime} currentTime={item.addDataTime} />
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                      <p style={{ color: "gray", fontSize: "small"}}>
                        {item.note} <br />
                        <span> &nbsp; &nbsp; &nbsp; &nbsp; {formatDate(item.addDataTime)}</span>
                      </p>
                    </div>
                    <img
                      onClick={() => {
                        removeItem(folderIndex, itemIndex);
                      }}
                      alt="delete"
                      src={deleteIcon}
                      style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      className="ms-auto"
                    />
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default SidePanel;