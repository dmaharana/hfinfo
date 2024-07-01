import { useState } from "react";

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";
  const buttonName = showForm ? "Close" : "Share a fact";

  function handleClickOpenForm() {
    setShowForm((show) => !show);
  }

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="50px" width="50px" alt="logo" />
        <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={handleClickOpenForm}>
        {buttonName}
      </button>
    </header>
  );
}

export default Header;
