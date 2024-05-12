import '../styles/Modal.css'

/* eslint-disable react/prop-types */
const Modal = ({ shouldShow, onRequestClose, children }) => {
  return shouldShow ? (
    <div className="ModalFull" onClick={onRequestClose} >
      <div className="modalDiv" onClick={(e) => {
          e.stopPropagation();
        }}>
        <button id="closeButton" onClick={onRequestClose}>
          X
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal