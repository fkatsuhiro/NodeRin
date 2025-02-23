import React, { useState } from "react"

const AddFormInFolder = ({ onClose }) => {
    const [inputFolderName, setInputFolderName] = useState("")
  const [inputURL, setInputURL] = useState("")
  const [inputMemo, setInputMemo] = useState("")
  
  const handleInputFolderNameChange = (e) => {
    setInputFolderName(e.target.value)
   }

  const handleInputURLChange = (e) => {
    setInputURL(e.target.value)
  }

  const handleInputMemoChange = (e) => {
    setInputMemo(e.target.value)
  }

  const handleAddButtonClick = () => {
    // 追加後の処理を書く
    console.log("AddURL:", inputURL)
    console.log("AddMemo:", inputMemo)
    
    // 入力内容をリセット
    setInputFolderName("")
    setInputURL("")
    setInputMemo("")
  }

  return (
    <div className="tab">
      <input
        type="text"
        value={inputFolderName}
        onChange={handleInputFolderNameChange}
        placeholder="フォルダ名を入力"
        className="input"
      />
      <input
        type="text"
        value={inputURL}
        onChange={handleInputURLChange}
        placeholder="URLを入力"
        className="input"
      />
      <input
        type="text"
        value={inputMemo}
        onChange={handleInputMemoChange}
        placeholder="メモを入力"
        className="input"
      />
      <button className="add-button" onClick={handleAddButtonClick}>
        Add
      </button>
    </div>
  )
}

export default AddFormInFolder