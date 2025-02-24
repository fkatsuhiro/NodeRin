import { Storage } from "@plasmohq/storage";
import type { Data, Folder } from "./sidepanel";
import { timeStamp } from "console";

const storage = new Storage();

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "save",
      title: "ページを追加/削除",
      contexts: ["all"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "save") {
      try {
        const activeTab = await storage.get<Data>("activeTab");
        if (!activeTab) return;
  
        const folders = (await storage.get<Folder[]>("folders")) ?? [];
        const folderIndex = folders.findIndex((folder) =>
          folder.items.some((item) => item.url === activeTab.url)
        );

        activeTab.timestamp = new Date().toISOString();
  
        if (folderIndex !== -1) {
          const folder = folders[folderIndex];
          const newItems = folder.items.filter((item) => item.url !== activeTab.url);
          folders[folderIndex] = { ...folder, items: newItems };
        } else {
          const newFolder: Folder = {
            name: "New Folder",
            note: "",
            items: [activeTab],
          };
          folders.push(newFolder);
        }
  
        await storage.set("folders", folders);
        chrome.runtime.sendMessage({
          type: "UPDATE",
        });
      } catch (error) {
        console.error("Error handling context menu click:", error);
      }
    }
  });
  
  function getActiveTabInfo() {
    const queryInfo = {
      active: true,
      currentWindow: true,
    };
  
    chrome.tabs.query(queryInfo, (tabs) => {
      if (tabs.length === 0) return;
      const activeTab = tabs[0];
      console.log("Active Tab URL:", activeTab.url);
      if (!activeTab) return;
  
      storage.set("activeTab", activeTab).catch((error) => {
        console.error("Error setting active tab info:", error);
      });
    });
  }
  
  // アクティブタブが変更されたときのイベントリスナー
  chrome.tabs.onActivated.addListener((activeInfo) => {
    getActiveTabInfo();
  });
  
  // タブが更新されたときのイベントリスナー
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // タブが完全に読み込まれたときに情報を取得
    if (changeInfo.status === "complete") {
      getActiveTabInfo();
    }
  });
  
  // 初回起動時にもタブ情報を取得
  getActiveTabInfo();