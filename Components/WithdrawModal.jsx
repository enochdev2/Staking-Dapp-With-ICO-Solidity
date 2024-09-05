import React, { useState } from "react";

import { IoMdClose } from "./ReactICON";
import PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import PupUpButton from "./Admin/RegularComp/PupUpButton";

const WithdrawModal = ({
  widthdraw,
  widthdrawPoolID,
  address,
  setLoader,
  claimReward,
}) => {
  const [amount, setAmount] = useState();

  const CALLING_FUNCTION = async (widthdrawPoolID, amount, address) => {
    setLoader(true);
    const receipt = await widthdraw(widthdrawPoolID, amount, address);

    if (receipt) {
      // console.log("receipt", pool);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  const CALLING_FUNCTION_REWARD = async (widthdrawPoolID) => {
    setLoader(true);
    const receipt = await claimReward(widthdrawPoolID);

    if (receipt) {
      // console.log("receipt", pool);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div
      className="modal modal--auto fade"
      id="modal-node"
      tabIndex={-1}
      aria-labelledby="modal-node"
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
            <h4 className="modal__title">Withdraw Token</h4>
            <p className="modal__text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
              magnam dolores eaque quia vero aliquid vitae, distinctio adipisci
            </p>
            <div className="modal__form">
              <PopUpInputField
                title={`Amount`}
                placeholder="Amount"
                handleChange={(e) => setAmount(e.target.value)}
              />

              <PupUpButton
                title={`Withdraw`}
                handbleClick={() =>
                  CALLING_FUNCTION(widthdrawPoolID, amount, address)
                }
              />

              <PupUpButton
                title={`Claim Reward`}
                handbleClick={() => CALLING_FUNCTION_REWARD(widthdrawPoolID)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
