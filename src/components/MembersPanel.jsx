import React from "react";

function MembersPanel({
  ownerId,
  currentUserId,
  members,
  isOwner,
  isArchived,
  onAddMember,
  onRemoveMember,
  onLeave,
}) {
  return (
    <section className="panel members-panel">
      <div className="panel__header">MEMBERS</div>
      <ul className="members-list">
        {members.map((m) => {
          const isThisOwner = m.id === ownerId;
          const isCurrent = m.id === currentUserId;

          return (
            <li key={m.id} className="member-row">
              <span className="member-row__icon">👤</span>
              <span className="member-row__name">
                {m.name}
                {isThisOwner && " (vlastník)"}
                {isCurrent && !isThisOwner && " (vy)"}
              </span>

              {isCurrent && !isThisOwner && !isArchived && (
                <button className="member-row__leave" onClick={onLeave}>
                  ODEJÍT
                </button>
              )}

              {isOwner && !isArchived && !isThisOwner && (
                <button
                  className="member-row__delete"
                  onClick={() => onRemoveMember(m.id)}
                >
                  🗑
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {isOwner && !isArchived && (
        <button className="members-panel__add" onClick={onAddMember}>
          + Přidat člena
        </button>
      )}
    </section>
  );
}

export default MembersPanel;
