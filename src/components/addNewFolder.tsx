import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type AddNewFolderProps = {
  onAddFolder: (folderName: string, note: string, currentPage: { title: string; url: string }) => void;
  onClose: () => void;
  currentPage: { title: string; url: string };
  initialFolderName?: string;
};

const AddNewFolder = ({ onAddFolder, onClose, currentPage, initialFolderName="" }: AddNewFolderProps) => {
  const [inputFolderName, setInputFolderName] = useState(initialFolderName);
  const [inputMemo, setInputMemo] = useState("");

  const handleInputFolderNameChange = (e) => {
    setInputFolderName(e.target.value);
  };

  const handleInputMemoChange = (e) => {
    setInputMemo(e.target.value);
  };

  const handleAddButtonClick = () => {
    onAddFolder(inputFolderName, inputMemo, currentPage);
    setInputFolderName("");
    setInputMemo("");
    onClose();
  };

  useEffect(() => {
    setInputFolderName(initialFolderName);
  }, [initialFolderName]);

  return (
    <div className="add-new-folder w-60" style={{margin: "0 auto"}}>
      <input
        type="text"
        value={inputFolderName}
        onChange={handleInputFolderNameChange}
        placeholder="フォルダ名を入力"
        className="input w-80 form-control mt-3"
      />
      <textarea
        value={inputMemo}
        onChange={handleInputMemoChange}
        placeholder="メモを入力"
        className="input w-80 form-control mt-3"
      />
      <div className="d-flex mt-3 ms-auto">
        <button className="btn btn-danger btn-sm ms-auto" onClick={handleAddButtonClick}>
          Add
        </button>
        <div >&nbsp;</div>
        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
      <hr className="mt-2" />
    </div>
  );
};

export default AddNewFolder;