import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import api from "../api/shoppingListApi";
import ListHeader from "../components/ListHeader";
import MembersPanel from "../components/MembersPanel";
import ItemsPanel from "../components/ItemsPanel";

const CURRENT_USER_ID = "u1";
const DEFAULT_LIST_ID = "list1";

function ShoppingListDetailRoute({ listId = DEFAULT_LIST_ID }) {
  const [list, setList] = useState(null);
  const [showDone, setShowDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.get({ id: listId });
        if (!active) return;
        setList(data);
      } catch (e) {
        if (!active) return;
        setError(e?.message || "Failed to load list");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [listId]);

  const isOwner = useMemo(() => {
    if (!list) return false;
    return list.ownerId === CURRENT_USER_ID;
  }, [list]);

  function handleRename() {
    if (!list || !isOwner || list.isArchived) return;
    const newName = window.prompt("Nový název seznamu:", list.name);
    if (newName && newName.trim()) {
      setList({ ...list, name: newName.trim() });
    }
  }

  function handleArchive() {
    if (!list || !isOwner) return;
    setList({ ...list, isArchived: true });
  }

  function handleDeleteList() {
    if (!list || !isOwner) return;
    if (window.confirm("Opravdu smazat seznam?")) {
      alert("Tady by se volalo API pro smazání. Zatím jen simulace.");
    }
  }

  function handleAddMember() {
    if (!list || !isOwner || list.isArchived) return;
    const name = window.prompt("Jméno nového člena:");
    if (!name || !name.trim()) return;
    const newId = "u" + (list.members.length + 1);
    setList({
      ...list,
      members: [...list.members, { id: newId, name: name.trim() }]
    });
  }

  function handleRemoveMember(memberId) {
    if (!list || !isOwner || list.isArchived) return;
    if (memberId === CURRENT_USER_ID) return;
    setList({
      ...list,
      members: list.members.filter((m) => m.id !== memberId)
    });
  }

  function handleLeave() {
    if (!list || isOwner) return;
    setList({
      ...list,
      members: list.members.filter((m) => m.id !== CURRENT_USER_ID)
    });
    alert("Odešel jsi ze seznamu (jen na FE).");
  }

  function handleToggleFilter() {
    setShowDone((prev) => !prev);
  }

  function handleAddItem() {
    if (!list || list.isArchived) return;
    const name = window.prompt("Název položky:");
    if (!name || !name.trim()) return;
    const newId = "i" + (list.items.length + 1);
    setList({
      ...list,
      items: [...list.items, { id: newId, name: name.trim(), isDone: false }]
    });
  }

  function handleDeleteItem(itemId) {
    if (!list || list.isArchived) return;
    setList({
      ...list,
      items: list.items.filter((i) => i.id !== itemId)
    });
  }

  function handleToggleDone(itemId) {
    if (!list || list.isArchived) return;
    setList({
      ...list,
      items: list.items.map((i) =>
        i.id === itemId ? { ...i, isDone: !i.isDone } : i
      )
    });
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
