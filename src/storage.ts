const STORAGE_KEY = "saved_urls"

// URLを保存
export const saveUrl = async (url: string) => {
  const urls = await getStoredUrls()
  if (!urls.includes(url)) {
    const newUrls = [...urls, url]
    await chrome.storage.local.set({ [STORAGE_KEY]: newUrls })
    return newUrls
  }
  return urls
}

// 保存されたURLを取得
export const getStoredUrls = async (): Promise<string[]> => {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return result[STORAGE_KEY] || []
}

// URLを削除
export const removeUrl = async (url: string) => {
  const urls = await getStoredUrls()
  const newUrls = urls.filter(u => u !== url)
  await chrome.storage.local.set({ [STORAGE_KEY]: newUrls })
  return newUrls
}
