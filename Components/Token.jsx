import React from "react";

const Token = ({ poolDetails }) => {
  console.log("poolDetails from Token component", poolDetails);

  return (
    <div className="section ">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-3">
            <div className="section__title">
              <h2>Token</h2>
              <p>More featrures with own Token.</p>
            </div>
          </div>
        </div>

        <div className="row  row-relative">
          <div className="col-12">
            <div className="invest invest--big">
              <h2 className="invest__title">Token</h2>
              <div className="row">
                <div className="col-12 col-lg-5">
                  <div className="invest__rate-wrap">
                    <div className="invest__rate">
                      <span>Stake Supply</span>
                      <p>
                        {poolDetails?.depositedToken.totalSupply}
                        {""}
                        {poolDetails?.depositedToken.symbol}
                      </p>
                    </div>

                    <div className="invest__green">
                      <img src="img/graph/graph2.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 offset-lg-1">
                  <div className="invest__rate_wrap">
                    <div className="invest__rate">
                      <span>Total Stake</span>
                      <p className="green">
                        {poolDetails?.depositedToken.contractTokenBalance.slice(
                          0,
                          10
                        )}{" "}
                        {poolDetails?.depositedToken.symbol}
                      </p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph1.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5">
                  <div className="invest__rate_wrap">
                    <div className="invest__rate">
                      <span>Reward Token</span>
                      <p className="red">
                        {poolDetails?.depositedToken.totalSupply}{" "}
                        {poolDetails?.rewardToken.symbol}
                      </p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph3.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-5 offset-lg-1">
                  <div className="invest__rate_wrap">
                    <div className="invest__rate">
                      <span>Total Stake</span>
                      <p className="green">1 TBC = 0.00001 ETH</p>
                    </div>

                    <div className="invest__graph">
                      <img src="img/graph/graph4.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="invest__info">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Expedita, dolor minus. Libero odit aliquid animi tenetur est
                vero enim, velit blanditiis recusandae soluta perspiciatis rem
                atque vitae magni suscipit expedita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
