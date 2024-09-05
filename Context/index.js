import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import {
  contract,
  tokenContract,
  ERC20,
  toEth,
  TOKEN_ICO_CONTRACT,
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
const notifyError = (msg) => toast.error(msg, { duration: 2000 });

//FUNCTIONS

function CONVERT_TIMESTAMP_TO_READABLE(timestamp) {
  const date = new Date(timestamp * 1000);

  const readableTime = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return readableTime;
}

function toWei(amount) {
  const toWei = ethers.utils.parseUnits(amount.toString());

  return toWei.toString();
}

function parseErrorMsg(e) {
  const json = JSON.parse(JSON.stringify(e));

  return json?.reason || json?.error?.message;
}

export const SHORTEN_ADDRESS = (address) =>
  `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;

export const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess("Address copied successfully!");
};

//READING DATA function
export async function CONTRACT_DATA(address) {
  try {
    const contractObj = await contract();
    const stakingTokenObj = await tokenContract();

    // console.log("contractObj", contractObj);

    if (address) {
      const contractOwner = await contractObj.owner();

      // console.log("contractObj from index", contractObj);

      const contractAddress = contractObj.address;

      //NOTIFICATION
      //reading the data

      const notifications = await contractObj.getNotification();

      console.log("notifications", notifications);

      // const _notificationsArray = await Promise.all(
      //   notifications.map(
      //     async ({ pooID, amount, user, typeOf, timestamp }) => {
      //       return {
      //         pooID: pooID.toNumber(),
      //         amount: toEth(amount),
      //         user: user,
      //         typeOf: typeOf,
      //         timeStamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),
      //       };
      //     }
      //   )
      // );

      //OR
      const _notificationsArray = await Promise.all(
        notifications.map((notification) => {
          const { poolID, amount, user, typeOf, timestamp } = notification;

          const notificationData = {
            poolID: poolID.toNumber(),
            amount: toEth(amount),
            user: user,
            typeOf: typeOf,
            timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),
          };

          return notificationData;
        })
      );

      console.log("_notificationsArray", _notificationsArray);

      //POOL INFORMATION
      //reading the data

      let poolInfoArray = [];
      const poolLenght = await contractObj.poolCount();
      const length = poolLenght.toNumber();

      for (let i = 0; i < length; i++) {
        const poolInfo = await contractObj.poolInfo(i);

        // console.log("poolInfo", poolInfo);

        const userInfo = await contractObj.userInfo(i, address); //this is the nested  mapping of the poolId(i) to the user
        const userReward = await contractObj.pendingReward(i, address);

        //getting the ERC20 token information/object at the stakingPoolContract with a particular user address
        const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address);
        const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address);

        //information of the poolTokenAddressess and pool token objects
        const pool = {
          //poolinfor
          depositTokenAddress: poolInfo.depositToken,
          rewardTokenAddress: poolInfo.rewardToken,
          depositToken: tokenPoolInfoA,
          rewardToken: tokenPoolInfoB,
          depositedAmount: toEth(poolInfo.depositedAmount.toString()),
          apy: poolInfo.apy.toString(),
          lockDays: poolInfo.lockDays.toString(),

          //user
          amount: toEth(userInfo.amount.toString()),
          userReward: toEth(userReward),
          lockUntil: CONVERT_TIMESTAMP_TO_READABLE(userInfo.lockUntil.toNumber),
          lastRewardAt: toEth(userInfo.lastRewardAt.toString()),
        };

        // console.log("pool", pool);

        poolInfoArray.push(pool);
      }

      // console.log("poolInfoArray", poolInfoArray);

      //lets get the total amount of token deposited by a single user in all the pool
      //since we looped using the user address then pushed it inside an array, note. We are still inside the user loop
      const totalDepositAmount = poolInfoArray.reduce((total, pool) => {
        return total + parseFloat(pool.depositedAmount);
      }, 0);

      const rewardToken = await ERC20(REWARD_TOKEN, address);
      const depositedToken = await ERC20(DEPOSIT_TOKEN, address);

      console.log("poolInfoArray from index context", poolInfoArray);

      const data = {
        contractOwner: contractOwner,
        contractAddress: contractAddress,
        notifications: _notificationsArray.reverse(),
        poolInfoArray: poolInfoArray,
        rewardToken: rewardToken,
        depositedToken: depositedToken,
        totalDepositAmount: totalDepositAmount,
        contractTokenBalance:
          depositedToken.contractTokenBalance - totalDepositAmount,
      };

      return data;
    }
  } catch (error) {
    console.log(error);

    console.log(parseErrorMsg(error));

    return parseErrorMsg(error);
  }
}

//WRITING DATA FUNCTION
export async function deposit(poolID, amount, address) {
  console.log("poolID", "amount", "address", poolID, amount, address);

  try {
    notifySuccess("calling contract...");

    const contractObj = await contract();
    //we will take stakingToken object in order to call the allowance/approve function.
    // This is necessary because the token contract needs to allow the
    //staking contract to transfer tokens on its behalf.

    const stakingTokenObj = await tokenContract();

    // const depositAmount = toWei(amount);
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

    const currentAllowance = await stakingTokenObj.allowance(
      address,
      contractObj.address
    );

    //if the current allowance is less than the deposit amount, approve the amount
    if (currentAllowance.lt(amountInWei)) {
      const approveTx = await stakingTokenObj.approve(
        contractObj.address,
        amountInWei
      );

      await approveTx.wait();

      console.log(`Approved ${amountInWei.toString()} token for staking`);
    }

    //we can calculate the gas we want to pay when we call a function to write on the blockchain
    //though they might have estimation for any function we want to call in the contract

    const gasEstimation = await contractObj.estimateGas.deposit(
      Number(poolID),
      amountInWei
    ); //this will give the gas estimation the deposit function call will cost,
    //we will use the estimation in the deposit function

    notifySuccess("Staking token call...");
    const stakeTx = await contractObj.deposit(poolID, amountInWei, {
      gasLimit: gasEstimation,
    });

    const receipt = await stakeTx.wait();
    notifySuccess("Token staked successfully");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function transferToken(amount, transferAddresss) {
  try {
    notifySuccess("calling contract token ...");
    //transfer from tokenObject
    const stakingTokenObj = await tokenContract();
    //if you want to make the transfer dynamic, we have to work on the tokenContract object and
    //dynamically pass different contract address in the
    // const contractReader = new ethers.Contract(
    //     Dynamic token addresss here,
    //     CustomTokenABI.abi,
    //     signer
    //   );

    const transferAmount = ethers.utils.parseEther(amount);

    const approveTx = await stakingTokenObj.transfer(
      transferAddresss,
      transferAmount
    );

    const receipt = await approveTx.wait();

    notifySuccess("token transfered successfully");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function widthdraw(poolID, amount) {
  try {
    notifySuccess("calling contract ...");
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    //widthdraw from contract oject//staking contract
    const contractObj = await contract();

    //estimate widthdrawal gas
    const gasEstimation = await contractObj.estimateGas.withdraw(
      Number(poolID),
      amountInWei
    );

    const data = await contractObj.withdraw(Number(poolID), amountInWei, {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("transaction successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function createPool(pool) {
  try {
    console.log("pool from context", pool);

    const { _depositToken, _rewardToken, _api, _lockDays } = pool;
    //checking if all pool data are provided
    if (!_depositToken || !_rewardToken || !_api || !_lockDays)
      return notifyError("Provide all the details");

    notifySuccess("calling contract...");

    //claims from contract oject//staking contract
    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.addPool(
      _depositToken,
      _rewardToken,
      Number(_api),
      Number(_lockDays)
    );

    console.log("gasEstimation", gasEstimation);

    const stakeTx = await contractObj.addPool(
      _depositToken,
      _rewardToken,
      Number(_api),
      Number(_lockDays),
      {
        gasLimit: gasEstimation,
      }
    );

    console.log("stakeTx", stakeTx);

    const receipt = await stakeTx.wait();
    console.log("receipt", receipt);

    notifySuccess(" Pool creation successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}
export async function claimReward(poolID) {
  try {
    notifySuccess("calling contract...");

    //claims from contract oject//staking contract
    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.claimReward(
      Number(poolID)
    );

    const data = await contractObj.claimReward(Number(poolID), {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Reward claim successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function modifyPool(poolID, amount) {
  try {
    notifySuccess("calling contract...");

    //modifypool from contract oject//staking contract
    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.modifyPool(
      Number(poolID),
      Number(amount)
    );

    const data = await contractObj.modifyPool(Number(poolID), Number(amount), {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Pool modification successfully completed");

    return receipt;
  } catch (error) {
    console.log(error);

    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

//sweep allow the contract owner to withdraw token out of it.
export async function sweep(tokenData) {
  try {
    const { token, amount } = tokenData;
    //check if data is missing
    if (!token || !amount) return notifyError("Data is missing");
    notifySuccess("calling contract...");

    //modifypool from contract oject//staking contract
    const contractObj = await contract();

    console.log("contractObj", contractObj);

    const transferAmount = ethers.utils.parseEther(amount);
    console.log();

    const gasEstimation = await contractObj.estimateGas.sweep(
      token,
      transferAmount
    );

    console.log("gasEstimation", gasEstimation);

    const data = await contractObj.sweep(token, transferAmount, {
      gasLimit: gasEstimation,
    });

    console.log("data", data);

    const receipt = await data.wait();
    notifySuccess("sweep successfully completed");

    console.log("receipt", receipt);

    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

//ADD TOKEN TO METAMASK
export const addTokenMetaMask = async () => {
  if (window.ethereum) {
    const contract = await tokenContract();

    const tokenDecimals = await contract.decimals();
    const tokenAddress = await contract.address;
    const tokenSymbol = await contract.symbol();
    const tokenImage = TOKEN_LOGO;

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        notifySuccess("TOken added successfully");
      } else {
        notifyError("Failed to add token");
      }
    } catch (error) {
      notifyError("Failed to add token");
    }
  } else {
    notifyError("MetaMask is not installed");
  }
};

//FUNCTIONALITIES FOR TOKEN ICO CONTRACT

//ICO CONTRACT

export const BUY_TOKEN = async (amount) => {
  try {
    notifySuccess("calling ico contract");
    const contract = await TOKEN_ICO_CONTRACT();

    //get the details of the token the user wants to buy from the TOKEN ico contract
    const tokenDetails = await contract.getTokenDetails();

    //get the avalable of that token in the TOKEN ICO contract ti know if the user can be able to
    //buy or not
    const availableToken = ethers.utils.formatEther(
      tokenDetails.balance.toString()
    );

    if (availableToken > 1) {
      const price =
        ethers.utils.formatEther(tokenDetails.tokenPrice.toString()) *
        Number(amount);

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      const transaction = await contract.buyTokens(Number(amount), {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000), //used this  cos get the gasEsstimation was throwing an error
      });

      const receipt = await transaction.wait();

      notifySuccess("Transaction succesffuly completed");
      return receipt;
    } else {
      notifyError("Token balance is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const TOKEN_WIDTHRAW = async () => {
  try {
    notifySuccess("calling ico contract");

    const contract = await TOKEN_ICO_CONTRACT();

    //get the details of the token the user wants to buy from the TOKEN ico contract
    const tokenDetails = await contract.getTokenDetails();
    //get the avalable of that token in the TOKEN ICO contract ti know if the user can be able to
    //buy or not
    const availableToken = ethers.utils.formatEther(
      tokenDetails.balance.toString()
    );

    if (availableToken > 1) {
      const transaction = await contract.withdrawAllTokens();
      const receipt = await transaction.wait();

      notifySuccess("Withdrawal succesffuly completed");
      return receipt;
    } else {
      notifyError("Token balance is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const UPDATE_TOKEN = async (_address) => {
  try {
    if (!_address) return notifyError("Data is missing");
    notifySuccess("Calling contract ...");

    const contract = await TOKEN_ICO_CONTRACT();

    // console.log("contract ICO contract", contract);

    const gasEstimation = await contract.estimateGas.updateToken(_address);

    // console.log("gasEstimation", gasEstimation);

    const transaction = await contract.updateToken(_address, {
      gasLimit: gasEstimation,
    });

    // console.log("transaction", transaction);

    const receipt = await transaction.wait();

    notifySuccess("Transaction succesffuly completed");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const UPDATE_TOKEN_PRICE = async (_price) => {
  try {
    if (!_price) return notifyError("Data is missing");
    notifySuccess("Calling contract ...");

    const contract = await TOKEN_ICO_CONTRACT();

    const payAmount = ethers.utils.parseUnits(_price.toString(), "ether");

    console.log("payAmount", payAmount);

    const gasEstimation = await contract.estimateGas.updateTokenSalePrice(
      payAmount
    );
    const transaction = await contract.updateTokenSalePrice(payAmount, {
      gasLimit: gasEstimation,
    });

    const receipt = await transaction.wait();

    notifySuccess("Transaction succesffuly completed");
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};
