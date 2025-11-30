import React, { useState } from "react";
import "../App.css";

function ShoppingListOverviewRoute({ lists, onCreateList, onDeleteList, onOpenList }) {
  const [showArchived, setShowArchived] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newArchived, setNewArchived] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const visibleLists = lists.filter((list) => showArchived || !list.isArchived);

  function handleToggleFilter() {
    setShowArchived((prev) => !prev);
  }

  function handleOpenAdd() {
    setIsAddOpen(true);
  }

  function handleCloseAdd() {
    setIsAddOpen(false);
    setNewName("");
    setNewArchived(false);
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    onCreateList({
      name: trimmedName,
      isArchived: newArchived,
      isOwner: true,
      itemsCount: 0
    });

    handleCloseAdd();
  }

  function handleRequestDelete(list) {
    if (!list.isOwner) return;
    setDeleteTarget(list);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    onDeleteList(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handleOpenDetail(list) {
    onOpenList(list);
  }

  return (
    <div className="OverviewRoot">
      <header className="OverviewHeader">
        <h1>Nákupní seznamy</h1>
      </header>

      <OverviewToolbar
        showArchived={showArchived}
        onToggleFilter={handleToggleFilter}
        onOpenAdd={handleOpenAdd}
      />

      <ShoppingListGrid
        lists={visibleLists}
        onOpenDetail={handleOpenDetail}
        onRequestDelete={handleRequestDelete}
      />

      {isAddOpen && (
        <AddListModal
          name={newName}
          isArchived={newArchived}
          onChangeName={setNewName}
          onChangeArchived={setNewArchived}
          onSubmit={handleAddSubmit}
          onCancel={handleCloseAdd}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          list={deleteTarget}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function OverviewToolbar({ showArchived, onToggleFilter, onOpenAdd }) {
  return (
    <div className="OverviewToolbar">
      <div className="OverviewToolbarLeft">
        <button className="ToolbarButton" onClick={onToggleFilter}>
          {showArchived ? "Zobrazit jen aktivní" : "Zobrazit včetně archivovaných"}
        </button>
      </div>
      <div className="OverviewToolbarRight">
        <button className="PrimaryButton" onClick={onOpenAdd}>
          + Přidat nový seznam
        </button>
      </div>
    </div>
  );
}

function ShoppingListGrid({ lists, onOpenDetail, onRequestDelete }) {
  if (lists.length === 0) {
    return (
      <div className="OverviewEmpty">
        Žádné nákupní seznamy k zobrazení.
      </div>
    );
  }

  return (
    <div className="OverviewGrid">
      {lists.map((list) => (
        <ShoppingListTile
          key={list.id}
          list={list}
          onOpenDetail={onOpenDetail}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}

function ShoppingListTile({ list, onOpenDetail, onRequestDelete }) {
  return (
    <div className="Tile">
      <div
        className="TileMain"
        onClick={() => onOpenDetail(list)}
        role="button"
      >
        <div className="TileTitleRow">
          <span className="TileTitle">{list.name}</span>
          {list.isArchived && <span className="TileBadge">Archivovaný</span>}
        </div>
        <div className="TileMeta">
          <span>Položky: {list.itemsCount}</span>
          <span>Role: {list.isOwner ? "vlastník" : "člen"}</span>
        </div>
      </div>
      <div className="TileActions">
        <button
          className="DeleteButton"
          disabled={!list.isOwner}
          onClick={() => onRequestDelete(list)}
        >
          Smazat
        </button>
      </div>
    </div>
  );
}

function AddListModal({
  name,
  isArchived,
  onChangeName,
  onChangeArchived,
  onSubmit,
  onCancel
}) {
  return (
    <div className="ModalOverlay">
      <div className="Modal">
        <h2>Nový nákupní seznam</h2>
        <form onSubmit={onSubmit} className="ModalForm">
          <label className="ModalField">
            Název
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Název seznamu"
            />
          </label>
          <label className="ModalCheckbox">
            <input
              type="checkbox"
              checked={isArchived}
              onChange={(e) => onChangeArchived(e.target.checked)}
            />
            Vytvořit rovnou jako archivovaný
          </label>
          <div className="ModalButtons">
            <button type="button" onClick={onCancel}>
              Zavřít
            </button>
            <button type="submit" className="PrimaryButton">
              Vytvořit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ list, onCancel, onConfirm }) {
  return (
    <div className="ModalOverlay">
      <div className="Modal">
        <h2>Smazat seznam</h2>
        <p>Opravdu chcete smazat seznam „{list.name}“?</p>
        <div className="ModalButtons">
          <button type="button" onClick={onCancel}>
            Zrušit
          </button>
          <button type="button" className="DeleteButton" onClick={onConfirm}>
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListOverviewRoute;
