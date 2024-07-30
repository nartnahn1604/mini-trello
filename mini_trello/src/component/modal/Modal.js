import BootStrapModal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";
import "./Modal.scss";

function Modal({
  children,
  isOpen,
  close,
  footer,
  title,
  centered = false,
  fullscreen = false,
  size = "lg",
}) {
  return (
    <BootStrapModal
      show={isOpen}
      onHide={close}
      centered={centered}
      fullscreen={fullscreen}
      size={size}
      dialogClassName="modal-container"
    >
      <BootStrapModal.Header className="header">
        <BootStrapModal.Title>{title}</BootStrapModal.Title>
        <CloseButton variant="white" onClick={close} />
      </BootStrapModal.Header>

      <BootStrapModal.Body className="body">{children}</BootStrapModal.Body>
      {footer && (
        <BootStrapModal.Footer className="footer">
          {footer}
        </BootStrapModal.Footer>
      )}
    </BootStrapModal>
  );
}

export default Modal;
