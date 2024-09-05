import React from "react";

const PupUpButton = ({ title, handbleClick }) => {
  return (
    <button onClick={handbleClick} className="form__btn " type="button">
      {title}
    </button>
  );
};

export default PupUpButton;
