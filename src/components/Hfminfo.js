import { useState } from "react";

function Hfminfo() {
  const baseUrl = "https://huggingface.co";
  const [modelName, setModelName] = useState("");
  const [modelInfo, setModelInfo] = useState("");

  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/models/${modelName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setModelInfo(JSON.stringify(json, null, 2));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p className="message">Hfminfo</p>
      <input
        type="text"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      />

      <br />
      {/* text field to show model info */}
      <input
        type="text"
        value={modelInfo}
        onChange={(e) => setModelInfo(e.target.value)}
      />
      <br />

      <button
        onClick={() => {
          fetchModelInfo();
        }}
      >
        Fetch
      </button>
      <pre>{modelInfo}</pre>
    </div>
  );
}

export default Hfminfo;
