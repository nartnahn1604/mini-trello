import { useDrag, useDrop } from "react-dnd";

export default function DragWrapper({
  id,
  key,
  parentID,
  index,
  className,
  type,
  item,
  findItem,
  moveItem,
  children,
}) {
  const [, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover({ id: draggedId }) {
      id = id.slice(id.indexOf("_") + 1);
      if (draggedId !== id) {
        const { index } = findItem(parentID, id);
        moveItem(parentID, draggedId, index);
      }
    },
  });

  const originalIndex = index;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type,
    item: { ...item, parentID, originalIndex },
    options: {
      dropEffect: "copy",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const { id: droppedId, originalIndex } = item;
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        moveItem(parentID, droppedId, originalIndex);
      } else {
        moveItem(null, null, -1, true);
      }
    },
  });

  return (
    <div id={id} key={key}>
      <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div ref={(node) => drag(drop(node))} className={className}>
          {children}
        </div>
      </div>
    </div>
  );
}
