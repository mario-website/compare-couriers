import React from "react";
import "./style.scss";

interface ModalProps {
  isSearchingTxt: string;
}

const Modal = ({isSearchingTxt}: ModalProps) => {
  return (
    <div className="modal">
      <span>
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>{isSearchingTxt}</p>
      </span>
    </div>
  );
};

export default Modal;
