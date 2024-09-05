import React from "react";
import { MdOutlineAttachMoney } from "./ReactICON/index";
import { FaRegCopy } from "react-icons/fa";

const Withdraw = ({ setwidthdrawPoolID, poolDetails }) => {
  const poolArray = poolDetails?.poolInfoArray ?? [];

  return (
    <div id="crypto" className="section">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 offset-md-2 col-xl-6 offset-lg-3 ">
            <div className="section__title">
              <h2>Staking rewards</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quo
                dolorum facere tenetur .
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {poolArray
            .map((pool, index) => (
              <div className={`col-12 col-md-6  col-lg-4`}>
                <div className="node">
                  <h3
                    className={`node__title node__title--${
                      index == 0
                        ? "orange"
                        : index == 1
                        ? "green"
                        : index == 2
                        ? "blue"
                        : "orange"
                    }`}
                  >
                    <b>{pool.amount}</b> {pool?.rewardToken.symbol}
                  </h3>
                  <span className="node__date">{pool?.lockDays} days</span>
                  <span className="node__price">
                    {" "}
                    <b>Reward:</b> {pool?.userReward} {pool?.rewardToken.symbol}
                  </span>

                  <span className="node__line">
                    <img src="img/dodgers/dots--line-orange.svg" alt="" />
                  </span>

                  <ul className="node__list">
                    <li>
                      <b>{pool?.depositToken.symbol}: &nbsp;</b>
                      {pool?.depositToken.address.slice(0, 15)}...
                      <FaRegCopy />
                    </li>
                    <li>
                      <b>{pool?.rewardToken.symbol}: &nbsp;</b>
                      {pool?.depositToken.address.slice(0, 15)}...
                      <FaRegCopy />
                    </li>
                    <li>
                      <b>Current APY: &nbsp;</b>
                      {pool?.apy} %
                    </li>
                    <li>
                      <b>LR&nbsp;</b>
                      {pool?.lastRewardAt}&nbsp;
                      {pool?.rewardToken.symbol}
                    </li>
                  </ul>

                  <button
                    className="apool__btn"
                    data-bs-target="#modal-node"
                    type="button"
                    data-bs-toggle="modal"
                    onClick={() =>
                      setwidthdrawPoolID(
                        index == 0 ? 0 : index == 1 ? 1 : index == 2 ? 2 : ""
                      )
                    }
                  >
                    Withdraw /Claim
                  </button>
                </div>
              </div>
            ))
            .slice(0, 3)}
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
