// draggableNode.js

export const DraggableNode = ({ type, label, icon, desc, cat }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="sidebar-card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="sidebar-card__header">
        <span className="sidebar-card__icon">{icon}</span>
        <span className="sidebar-card__label">{label}</span>
      </div>
      {desc && <div className="sidebar-card__desc">{desc}</div>}
      {cat && <span className="sidebar-card__cat">{cat}</span>}
    </div>
  );
};
