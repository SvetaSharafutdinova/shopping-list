import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import api from "../api/shoppingListApi";
import ListHeader from "../components/ListHeader";
import MembersPanel from "../components/MembersPanel";
import ItemsPanel from "../components/ItemsPanel";

const CURRENT_USER_ID = "u1";

function ShoppingListDetailRoute({ listId }) {
  const [list, setList] = useState(null);
  const [showDone, setShowDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load(id) {
    setLoading(true);
    setError("");
    try {
      const data = await api.get({ id });
      setList(data);
    } catch (e) {
      setError(e?.message || "Failed to load list");
      setList(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!listId) return;
    let active = true;

    (async () => {
      if (!active) return;
      await load(listId);
    })();

    return () => {
      active = false;
    };
  }, [listId]);

  const isOwner = useMemo(() => {
    if (!list) return false;
    return list.ownerId === CURRENT_USER_ID;
  }, [list]);

  async function handleRename() {
    if (!list || !isOwner || list.isArchived || busy) return;
    const newName = window.prompt("Nový název seznamu:", list.name);
    const trimmed = (newName || "").trim();
    if (!trimmed) return;

    setBusy(true);
    setError("");
    try {
      await api.update({ id: list.id, name: trimmed });
      await load(list.id);
    } catch (e) {
      setError(e?.message || "Failed to rename list");
    } finally {
      setBusy(false);
    }
  }

  async function handleArchive() {
    if (!list || !isOwner || busy) return;

    setBusy(true);
    setError("");
    try {
      await api.update({ id: list.id, isArchived: true });
      await load(list.id);
    } catch (e) {
      setError(e?.message || "Failed to archive list");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteList() {
    if (!list || !isOwner || busy) return;
    const ok = window.confirm("Opravdu smazat seznam?");
    if (!ok) return;

    setBusy(true);
    setError("");
    try {
      await api.remove({ id: list.id });
      setList(null);
    } catch (e) {
      setError(e?.message || "Failed to delete list");
    } finally {
      setBusy(false);
    }
  }

  function handleAddMember() {
    if (!list || !isOwner || list.isArchived || busy) return;
    const name = window.prompt("Jméno nového člena:");
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    const newId = "u" + (list.members.length + 1);
    setList({
      ...list,
      members: [...list.members, { id: newId, name: trimmed }]
    });
  }

  function handleRemoveMember(memberId) {
    if (!list || !isOwner || list.isArchived || busy) return;
    if (memberId === CURRENT_USER_ID) return;

    setList({
      ...list,
      members: list.members.filter((m) => m.id !== memberId)
    });
  }

  function handleLeave() {
    if (!list || isOwner || busy) return;

    setList({
      ...list,
      members: list.members.filter((m) => m.id !== CURRENT_USER_ID)
    });
  }

  function handleToggleFilter() {
    setShowDone((prev) => !prev);
  }

  function handleAddItem() {
    if (!list || list.isArchived || busy) return;
    const name = window.prompt("Název položky:");
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    const newId = "i" + (list.items.length + 1);
    setList({
      ...list,
      items: [...list.items, { id: newId, name: trimmed, isDone: false }]
    });
  }

  function handleDeleteItem(itemId) {
    if (!list || list.isArchived || busy) return;
    setList({
      ...list,
      items: list.items.filter((i) => i.id !== itemId)
    });
  }

  function handleToggleDone(itemId) {
    if (!list || list.isArchived || busy) return;
    setList({
      ...list,
      items: list.items.map((i) =>
        i.id === itemId ? { ...i, isDone: !i.isDone } : i
      )
    });
  }

  if (!listId) {
    return <div className="page">No list selected</div>;
  }

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (error) {
    return <div className="page">{error}</div>;
  }

  if (!list) {
    return <div className="page">List not found</div>;
  }

  return (
    <div className="page">
      <ListHeader
        name={list.name}
        isArchived={list.isArchived}
        isOwner={isOwner}
        onRename={handleRename}
        onArchive={handleArchive}
        onDelete={handleDeleteList}
      />

      <div className="content">
        <MembersPanel
          ownerId={list.ownerId}
          currentUserId={CURRENT_USER_ID}
          members={list.members}
          isOwner={isOwner}
          isArchived={list.isArchived}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onLeave={handleLeave}
        />

        <ItemsPanel
          items={list.items}
          isArchived={list.isArchived}
          showDone={showDone}
          onToggleFilter={handleToggleFilter}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onToggleDone={handleToggleDone}
        />
      </div>
    </div>
  );
}

export default ShoppingListDetailRoute;
