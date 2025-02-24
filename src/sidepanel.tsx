import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import AddNewFolder from "./components/addNewFolder";
import deleteIcon from './assets/deleteIcon.png';
import plusIcon from './assets/plusIcon.png';
import exportIcon from './assets/exportIcon.png';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/style.css';

export type Data = {
  title: string;
  url: string;
  note?: string;
  addDataTime : string;
};

export type Folder = {
  name: string;
  note: string;
  items: Data[];
};

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
        addDataTime: ""
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
      items: [{ ...currentPage, note, addDataTime: new Date().toISOString() }]
    };
    setFolders([...folders, newFolder]);
  };

  const handleAddItemToFolder = (folderName: string, note: string) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.name === folderName) {
        return {
          ...folder,
          items: [...folder.items, { ...currentPage, note, addDataTime: new Date().toISOString() }]
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  const handleExportSpreadSheet = () => {
    const csvHeader = "Folder title, URL title, URL, URL detail, Time Stamp \n";
    const csvData = folders.map((folder) => {
      const folderData = folder.items.map((item) => {
        return `${folder.name},${item.title},${item.url},${item.note}, ${item.addDataTime}`;
      });
      return folderData.join("\n");
    }).join("\n");

    const csvContent = csvHeader + csvData;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'folders.csv';
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

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <div className="d-flex">
      <img
        onClick={() => {
          setInitialFolderName(null);
          setShowAddFolder(true);
        }}
        alt="add"
        src={plusIcon}
        style={{ width: "30px", height: "30px", cursor: "pointer" }}
      />
      <h3 className="mx-auto">Save URLs!!</h3>
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
                  onClick={handleExportSpreadSheet}
                  alt="spreadsheet"
                  src={exportIcon}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  className="ms-auto"
                />
                <img
                  onClick={() => removeFolder(folderIndex)}
                  alt="delete"
                  src={deleteIcon}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  className="ms-auto"
                />
              </summary>
              <ul style={{ listStyle: "none", width: "100%" }}>
                {folder.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: 8 }} className="d-flex mt-2">
                    <div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                      <p style={{ color: "gray", fontSize: "small"}}>{item.note}</p>
                      <p>{item.addDataTime}</p>
                    </div>
                    <img
                      onClick={() => removeItem(folderIndex, itemIndex)}
                      alt="delete"
                      src={deleteIcon}
                      style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      className="ms-auto"
                    />
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