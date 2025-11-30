import React, { useState } from "react";
import ShoppingListOverviewRoute from "./routes/ShoppingListOverviewRoute";
import ShoppingListDetailRoute from "./routes/ShoppingListDetailRoute";

const INITIAL_LISTS = [
  { id: 1, name: "Weekend Shopping", isArchived: false, isOwner: true, itemsCount: 2 },
  { id: 2, name: "Office Purchases", isArchived: true, isOwner: true, itemsCount: 5 },
  { id: 3, name: "Holiday List", isArchived: false, isOwner: false, itemsCount: 3 }
];

function App() {
  const [lists, setLists] = useState(INITIAL_LISTS);
  const [selectedList, setSelectedList] = useState(null);

  function handleCreateList(list) {
    const newId = Math.max(...lists.map(l => l.id)) + 1;
    setLists([...lists, { id: newId, ...list }]);
  }

  function handleDeleteList(id) {
    setLists(lists.filter(l => l.id !== id));
  }

  function openDetail(list) {
    setSelectedList(list);
  }

  function goBack() {
    setSelectedList(null);
  }

  return selectedList ? (
    <ShoppingListDetailRoute list={selectedList} onBack={goBack} />
  ) : (
    <ShoppingListOverviewRoute lists={lists} onCreateList={handleCreateList} onDeleteList={handleDeleteList} onOpenList={openDetail} />
  );
}

export default App;
