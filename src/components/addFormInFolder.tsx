import React, { useState } from "react"

const AddFormInFolder = ({ onClose }) => {
  const [inputURL, setInputURL] = useState("")
  const [inputMemo, setInputMemo] = useState("")

  const handleInputURLChange = (e) => {
    setInputURL(e.target.value)
  }

  const handleInputMemoChange = (e) => {
    setInputMemo(e.target.value)
  }

  const handleAddButtonClick = () => {
    onClose()
    // 追加後の処理を書く
    console.log("AddURL:", inputURL)
    console.log("AddMemo:", inputMemo)
  }

  return (
    <div className="tab">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
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