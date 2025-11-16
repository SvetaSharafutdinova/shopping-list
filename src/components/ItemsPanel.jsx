import React from "react";

function ItemsPanel({
  items,
  isArchived,
  showDone,
  onToggleFilter,
  onAddItem,
  onDeleteItem,
  onToggleDone,
}) {
  const visibleItems = showDone ? items : items.filter((i) => !i.isDone);

  return (
    <section className="panel items-panel">
      <div className="panel__header">
        <span>POLOŽKY</span>
        <button className="filter-button" onClick={onToggleFilter}>
          {showDone ? "ZOBRAZIT JEN NEVYŘEŠENÉ" : "ZOBRAZIT VŠE"}
        </button>
      </div>

      <ul className="items-list">
        {visibleItems.map((item) => (
          <li key={item.id} className="item-row">
            <button
              className={`item-row__status ${item.isDone ? "item-row__status--done" : ""}`}
              onClick={() => !isArchived && onToggleDone(item.id)}
              disabled={isArchived}
            >
              {item.isDone ? "✔" : ""}
            </button>

            <span
              className={`item-row__name ${item.isDone ? "item-row__name--done" : ""}`}
            >
              {item.name}
            </span>

            {!isArchived && (
              <button
                className="item-row__delete"
                onClick={() => onDeleteItem(item.id)}
              >
                🗑
              </button>
            )}
          </li>
        ))}
      </ul>

      {!isArchived && (
        <button className="items-panel__add" onClick={onAddItem}>
          + Přidat položku
        </button>
      )}
    </section>
  );
}

export default ItemsPanel;
