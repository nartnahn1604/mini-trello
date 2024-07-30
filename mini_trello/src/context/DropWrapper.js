import { useDrop } from "react-dnd";

export default function DropWrapper({ className, type, drop, children }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: type,
    drop: (item, monitor) => drop(item, monitor),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={className}
      style={{ backgroundColor: isOver ? "rgba(0,0,0,0.1)" : "" }}
    >
      {children}
    </div>
  );
}
