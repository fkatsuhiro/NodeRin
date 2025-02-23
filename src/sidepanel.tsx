import { useState, useEffect } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import AddNewFolder from "./components/addNewFolder";
import deleteIcon from './assets/deleteIcon.png';
import plusIcon from './assets/plusIcon.png';
import "bootstrap/dist/css/bootstrap.min.css";

type Data = {
  title: string;
  url: string;
  note?: string;
};

type Folder = {
  name: string;
  note: string;
  items: Data[];
};

function SidePanel() {
  const [folders, setFolders] = useStorage<Folder[]>("folders", []);
  const [currentPage, setCurrentPage] = useState<Data>({
    title: "",
    url: ""
  });
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [initialFolderName, setInitialFolderName] = useState<string | null>(null);

  // 現在のタブ情報を取得
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab) return;

      setCurrentPage({
        title: activeTab.title || "There are no title",
        url: activeTab.url || "There are no url"
      });
    });
  }, []);

  const handleAddFolder = (folderName: string, note: string, currentPage: Data) => {
    const newFolder: Folder = {
      name: folderName,
      note: note,
      items: [{ ...currentPage, note }]
    };
    setFolders([...folders, newFolder]);
  };

  const handleAddItemToFolder = (folderName: string, note: string, currentPage: Data) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.name === folderName) {
        return {
          ...folder,
          items: [...folder.items, { ...currentPage, note }]
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  const removeItem = (folderIndex: number, itemIndex: number) => {
    const updatedFolders = folders.map((folder, i) => {
      if (i === folderIndex) {
        return {
          ...folder,
          items: folder.items.filter((_, index) => index !== itemIndex)
        };
      }
      return folder;
    });
    setFolders(updatedFolders);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 16 }}>
      <h2>You can save some URLs!!</h2>
      <img
        onClick={() => {
          setInitialFolderName(null);
          setShowAddFolder(true);
        }}
        alt="add"
        src={plusIcon}
        style={{ width: "40px", height: "40px", cursor: "pointer" }}
      />
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
                {folder.name}
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
              </summary>
              <ul style={{ listStyle: "none", width: "100%" }}>
                {folder.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: 8 }} className="d-flex mt-2">
                    <div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                      <p>{item.note}</p>
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
  );
}

export default SidePanel;