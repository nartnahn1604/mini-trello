import "./Button.scss";

export default function Button({
  children,
  variant,
  className,
  title,
  type,
  formId,
  onClick,
  disabled,
  style,
}) {
  return (
    <button
      type={type ? type : "button"}
      form={type === "submit" && formId ? formId : ""}
      className={`btn ${variant ? variant : ""} ${className ? className : ""}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

function Text({ text, className, onClick }) {
  return (
    <span className={`text ${className}`} onClick={onClick}>
      {text}
    </span>
  );
}
function Image({ children, image, title, className, onClick }) {
  return (
    <span
      className={`img ${className ? className : ""}`}
      title={title}
      onClick={onClick}
    >
      {image}
      {children}
    </span>
  );
}

Button.Text = Text;
Button.Image = Image;
