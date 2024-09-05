import React, { useState } from "react";

import { IoMdClose } from "../ReactICON";

const UpdateAPYModel = ({ setLoader, modifyPool, modifyPoolID }) => {
  const [amount, setAmount] = useState();

  const CALLING_FUNCTION_MODIFY_POOL = async (modifyPoolID, amount) => {
    setLoader(true);
    console.log("modifyPoolID", "amount", modifyPoolID, amount);
    const receipt = await modifyPool(modifyPoolID, amount);

    if (receipt) {
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  return (
    <div
      className="modal modal--auto fade"
      id="modal-apool"
      aria-labelledby="modal-apool"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-x">
                <IoMdClose />
              </i>
            </button>
            <h4 className="modal__title">Invest</h4>
            <p className="modal__text">
              Update staking pool #00-{modifyPoolID} APY%
            </p>
            <div className="modal__form">
              <label htmlFor="form__label">Enter</label>
              <input
                type="text"
                id="amount2"
                className="apool__input"
                style={{
                  backgroundColor: "transparent",
                }}
                placeholder="amount in %"
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                onClick={() =>
                  CALLING_FUNCTION_MODIFY_POOL(modifyPoolID, amount)
                }
                className="form__btn"
                type="button"
              >
                Update APY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAPYModel;
