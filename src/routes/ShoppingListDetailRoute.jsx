import React, { useState } from "react";
import "../App.css";
import ListHeader from "../components/ListHeader";
import MembersPanel from "../components/MembersPanel";
import ItemsPanel from "../components/ItemsPanel";

const CURRENT_USER_ID = "u1";

const INITIAL_LIST = {
  id: "list1",
  name: "Seznam pro víkend",
  ownerId: "u1",
  isArchived: false,
  members: [
    { id: "u1", name: "Já (vlastník)" },
    { id: "u2", name: "Petra" },
    { id: "u3", name: "Adam" },
    { id: "u4", name: "Jana" },
  ],
  items: [
    { id: "i1", name: "Mléko", isDone: false },
    { id: "i2", name: "Chléb", isDone: true },
    { id: "i3", name: "Voda", isDone: false },
  ],
};

function ShoppingListDetailRoute() {
  const [list, setList] = useState(INITIAL_LIST);
  const [showDone, setShowDone] = useState(false);

  const isOwner = list.ownerId === CURRENT_USER_ID;

  function handleRename() {
    if (!isOwner || list.isArchived) return;
    const newName = window.prompt("Nový název seznamu:", list.name);
    if (newName && newName.trim()) {
      setList({ ...list, name: newName.trim() });
    }
  }

  function handleArchive() {
    if (!isOwner) return;
    setList({ ...list, isArchived: true });
  }

  function handleDeleteList() {
    if (!isOwner) return;
    if (window.confirm("Opravdu smazat seznam?")) {
      alert("Tady by se volalo API pro smazání. Zatím jen simulace.");
    }
  }

  function handleAddMember() {
    if (!isOwner || list.isArchived) return;
    const name = window.prompt("Jméno nového člena:");
    if (!name || !name.trim()) return;
    const newId = "u" + (list.members.length + 1);
    setList({
      ...list,
      members: [...list.members, { id: newId, name: name.trim() }],
    });
  }

  function handleRemoveMember(memberId) {
    if (!isOwner || list.isArchived) return;
    if (memberId === CURRENT_USER_ID) return;
    setList({
      ...list,
      members: list.members.filter((m) => m.id !== memberId),
    });
  }

  function handleLeave() {
    if (isOwner) return;
    setList({
      ...list,
      members: list.members.filter((m) => m.id !== CURRENT_USER_ID),
    });
    alert("Odešel jsi ze seznamu (jen na FE).");
  }

  function handleToggleFilter() {
    setShowDone((prev) => !prev);
  }

  function handleAddItem() {
    if (list.isArchived) return;
    const name = window.prompt("Název položky:");
    if (!name || !name.trim()) return;
    const newId = "i" + (list.items.length + 1);
    setList({
      ...list,
      items: [...list.items, { id: newId, name: name.trim(), isDone: false }],
    });
  }

  function handleDeleteItem(itemId) {
    if (list.isArchived) return;
    setList({
      ...list,
      items: list.items.filter((i) => i.id !== itemId),
    });
  }

  function handleToggleDone(itemId) {
    if (list.isArchived) return;
    setList({
      ...list,
      items: list.items.map((i) =>
        i.id === itemId ? { ...i, isDone: !i.isDone } : i
      ),
    });
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
