import React, { useContext, useEffect, useMemo, useState } from "react";
import { I18nContext } from "../context/I18nContext";
import TopBar from "../components/TopBar";
import OverviewItemsChart from "../components/OverviewItemsChart";
import "../App.css";
import api from "../api/shoppingListApi";

function ShoppingListOverviewRoute({ onOpenList }) {
  const { t, lang, setLang, theme, setTheme } = useContext(I18nContext);

  const [showArchived, setShowArchived] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newArchived, setNewArchived] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.list({ includeArchived: true });
      setLists(res.itemList || []);
    } catch (e) {
      setError(e?.message || t("common.loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleLists = useMemo(() => {
    return lists.filter((list) => showArchived || !list.isArchived);
  }, [lists, showArchived]);

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

  async function handleAddSubmit(event) {
    event.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    setError("");
    try {
      await api.create({ name: trimmedName, isArchived: newArchived });
      await load();
      handleCloseAdd();
    } catch (e) {
      setError(e?.message || t("overview.createError"));
    }
  }

  function handleRequestDelete(list) {
    if (!list.isOwner) return;
    setDeleteTarget(list);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    setError("");
    try {
      await api.remove({ id: deleteTarget.id });
      await load();
      setDeleteTarget(null);
    } catch (e) {
      setError(e?.message || t("overview.deleteError"));
    }
  }

  function handleOpenDetail(list) {
    onOpenList(list);
  }

  return (
    <div className="OverviewRoot">
      <TopBar
        title={t("overview.title")}
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="OverviewToolbar">
        <div className="OverviewToolbarLeft">
          <button className="ToolbarButton" onClick={handleToggleFilter}>
            {showArchived ? t("overview.showActive") : t("overview.showArchived")}
          </button>
        </div>
        <div className="OverviewToolbarRight">
          <button className="PrimaryButton" onClick={handleOpenAdd}>
            {t("overview.addNew")}
          </button>
        </div>
      </div>

      <div className="OverviewChartWrap">
        <OverviewItemsChart lists={visibleLists} />
      </div>

      {error && <div className="OverviewEmpty">{error}</div>}
      {loading && <div className="OverviewEmpty">{t("common.loading")}</div>}

      {!loading && (
        <ShoppingListGrid
          lists={visibleLists}
          onOpenDetail={handleOpenDetail}
          onRequestDelete={handleRequestDelete}
          t={t}
        />
      )}

      {isAddOpen && (
        <AddListModal
          t={t}
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
          t={t}
          list={deleteTarget}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function ShoppingListGrid({ lists, onOpenDetail, onRequestDelete, t }) {
  if (lists.length === 0) {
    return <div className="OverviewEmpty">{t("overview.empty")}</div>;
  }

  return (
    <div className="OverviewGrid">
      {lists.map((list) => (
        <ShoppingListTile
          key={list.id}
          list={list}
          onOpenDetail={onOpenDetail}
          onRequestDelete={onRequestDelete}
          t={t}
        />
      ))}
    </div>
  );
}

function ShoppingListTile({ list, onOpenDetail, onRequestDelete, t }) {
  return (
    <div className="Tile">
      <div className="TileMain" onClick={() => onOpenDetail(list)} role="button">
        <div className="TileTitleRow">
          <span className="TileTitle">{list.name}</span>
          {list.isArchived && <span className="TileBadge">{t("overview.archived")}</span>}
        </div>
        <div className="TileMeta">
          <span>
            {t("overview.items")}: {list.itemsCount}
          </span>
          <span>
            {t("overview.role")}: {list.isOwner ? t("overview.owner") : t("overview.member")}
          </span>
        </div>
      </div>
      <div className="TileActions">
        <button
          className="DeleteButton"
          disabled={!list.isOwner}
          onClick={() => onRequestDelete(list)}
        >
          {t("overview.delete")}
        </button>
      </div>
    </div>
  );
}

function AddListModal({ t, name, isArchived, onChangeName, onChangeArchived, onSubmit, onCancel }) {
  return (
    <div className="ModalOverlay">
      <div className="Modal">
        <h2>{t("overview.newTitle")}</h2>
        <form onSubmit={onSubmit} className="ModalForm">
          <label className="ModalField">
            {t("overview.name")}
            <input
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder={t("overview.namePlaceholder")}
            />
          </label>
          <label className="ModalCheckbox">
            <input
              type="checkbox"
              checked={isArchived}
              onChange={(e) => onChangeArchived(e.target.checked)}
            />
            {t("overview.createArchived")}
          </label>
          <div className="ModalButtons">
            <button type="button" onClick={onCancel}>
              {t("common.close")}
            </button>
            <button type="submit" className="PrimaryButton">
              {t("common.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ t, list, onCancel, onConfirm }) {
  return (
    <div className="ModalOverlay">
      <div className="Modal">
        <h2>{t("overview.deleteTitle")}</h2>
        <p>
          {t("overview.deleteConfirm")} „{list.name}“?
        </p>
        <div className="ModalButtons">
          <button type="button" onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button type="button" className="DeleteButton" onClick={onConfirm}>
            {t("overview.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListOverviewRoute;
