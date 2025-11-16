import React from "react";

function ListHeader({ name, isArchived, isOwner, onRename, onArchive, onDelete }) {
  return (
    <header className="list-header">
      <div className="list-header__left">
        <h1 className="list-header__title">
          {name}{" "}
          {isArchived && <span className="list-header__archived">(ARCHIVOVANÝ)</span>}
        </h1>
      </div>

      <div className="list-header__right">
        {isOwner && (
          <>
            <button onClick={onRename}>UPRAVIT</button>
            <button onClick={onArchive}>ARCHIVOVAT</button>
            <button onClick={onDelete}>SMAZAT</button>
          </>
        )}
      </div>
    </header>
  );
}

export default ListHeader;
