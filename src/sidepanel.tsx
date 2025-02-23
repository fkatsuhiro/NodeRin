import { useState } from "react"
import AddFormInFolder from "./components/addFormInFolder"
import AddNewFolder from "./components/addNewFolder"

function IndexSidePanel() {
  const [data, setData] = useState("")
  const [showTab, setShowTab] = useState(false)

  const handleButtonClick = () => {
    setShowTab(true)
  }

  const handleCloseTab = () => {
    setShowTab(false)
  }

  return (
    <div className="container">
      <AddNewFolder />

      <button className="button" onClick={handleButtonClick}>
        Add
      </button>
      {showTab && <AddFormInFolder onClose={handleCloseTab} />}
    </div>
  )
}

export default IndexSidePanel