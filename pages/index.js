import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

//INTERNAL IMPORT
import {
  Header,
  HeroSection,
  Footer,
  Pools,
  PoolsModel,
  WithdrawModal,
  Withdraw,
  Partners,
  Statistics,
  Token,
  Loader,
  Notification,
  ICOSale,
  Contact,
  Ask,
} from "../Components/index";

import {
  CONTRACT_DATA,
  deposit,
  widthdraw,
  claimReward,
  addTokenMetaMask,
} from "../Context/index";
import { add } from "lodash";

const index = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [poolID, setPoolID] = useState();
  const [widthdrawPoolID, setwidthdrawPoolID] = useState();

  const [poolDetails, setPoolDetails] = useState();
  const [selectedToken, setSelectedToken] = useState();
  const [selectedPool, setSelectedPool] = useState();

  const LOAD_DATA = async () => {
    if (address) {
      setLoader(true);
      const data = await CONTRACT_DATA(address);
      // console.log("data", data);

      setPoolDetails(data);

      setLoader(false);
    }
  };

  useEffect(() => {
    LOAD_DATA();
  }, [address]);

  return (
    <>
      <Header />
      <HeroSection
        poolDetails={poolDetails}
        addTokenMetaMask={addTokenMetaMask}
      />
      <Statistics poolDetails={poolDetails} />
      <Pools
        setPoolID={setPoolID}
        setPoolDetails={setPoolDetails}
        poolDetails={poolDetails}
        setSelectedPool={setSelectedPool}
        setSelectedToken={setSelectedToken}
      />
      <Token poolDetails={poolDetails} />

      <Withdraw
        setwidthdrawPoolID={setwidthdrawPoolID}
        poolDetails={poolDetails}
      />
      <Notification poolDetails={poolDetails} />
      <Partners />
      <Ask setContactUs={setContactUs} />
      <Footer />

      {/* MODAL */}
      <PoolsModel
        deposit={deposit}
        poolID={poolID}
        address={address}
        selectedPool={selectedPool}
        selectedToken={selectedToken}
        setLoader={setLoader}
      />

      <WithdrawModal
        widthdraw={widthdraw}
        widthdrawPoolID={widthdrawPoolID}
        address={address}
        setLoader={setLoader}
        claimReward={claimReward}
      />

      <ICOSale setLoader={setLoader} />

      {contactUs && <Contact setContactUs={setContactUs} />}

      {loader && <Loader />}
    </>
  );
};

export default index;
