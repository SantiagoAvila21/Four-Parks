import '../styles/Modal.css'

/* eslint-disable react/prop-types */
const Modal = ({ shouldShow, onRequestClose, green, children, close }) => {
  return shouldShow ? (
    <div className="ModalFull" onClick={onRequestClose} >
      <div className={`modalDiv ${green}`} onClick={(e) => {
          e.stopPropagation();
        }}>
        {close && 
          <button id="closeButton" onClick={onRequestClose}>
            X
          </button>
        }
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal