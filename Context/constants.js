import { ethers } from "ethers";
import StakingDappABI from "./StakingDapp.json";
import TokenICO from "./TokenICO.json";
import CustomTokenABI from "./ERC20.json";

//CONTRACT
const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOKEN_ICO = process.env.NEXT_PUBLIC_TOKEN_ICO;

//TOKEN
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

//WALLET
//UTILITY FUNCTION

//function to convert any number to ETHER
export function toEth(amount, decimals = 18) {
  // const amountBN = BigNumber.from(amount);

  const toEth = ethers.utils.formatUnits(amount, decimals);
  return toEth.toString();
}

//the native token contract se allow ussers to deposstit
export const tokenContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      DEPOSIT_TOKEN,
      CustomTokenABI.abi,
      signer
    );

    return contractReader;
  }
};

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      STAKING_DAPP_ADDRESS,
      StakingDappABI.abi,
      signer
    );

    // console.log("contractReader", contractReader);

    return contractReader;
  }
};

//get specific information about a particular token together with the address
export const ERC20 = async (address, userAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      address,
      CustomTokenABI.abi,
      signer
    );

    // console.log(
    //   "contractReader from ERC20",
    //   ethers.utils.formatEther(contractReader.totalSupply(), 18)
    // );

    const token = {
      name: await contractReader.name(),
      symbol: await contractReader.symbol(),
      address: await contractReader.address,
      totalSupply: toEth(await contractReader.totalSupply()),
      balance: toEth(await contractReader.balanceOf(userAddress)),
      contractTokenBalance: toEth(
        await contractReader.balanceOf(STAKING_DAPP_ADDRESS)
      ),
    };

    return token;
  }
};

//TOKEN ICO CONTRACT

export const LOAD_TOKEN_ICO = async () => {
  try {
    const contract = await TOKEN_ICO_CONTRACT();

    // console.log("tokenICO contract", contract);

    const tokenAddress = await contract.tokenAddress();
    // const tokenAddress = "0xb9e34FFEe08675A16CFE0842a3A3D0A65e4E0DC5";

    const ZERO_ADDRESSS = 0x0000000000000000000000000000000000000000;

    if (tokenAddress != ZERO_ADDRESSS) {
      // console.log("token Addresss", tokenAddress);

      const tokenDetails = await contract.getTokenDetails();

      // console.log("tokenDetails of LOAD_TOKEN_ICO", tokenDetails);

      const contractOwner = await contract.owner();
      const soldTokens = await contract.soldTokens();
      const ICO_TOKEN = await TOKEN_ICO_ERC20();

      const token = {
        tokenBal: ethers.utils.formatEther(tokenDetails.balance.toString()),
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        tokenPrice: ethers.utils.formatEther(
          tokenDetails.tokenPrice.toString()
        ),
        tokenAddr: tokenDetails.tokenAddr,
        owner: contractOwner.toLowerCase(),
        soldTokens: soldTokens.toNumber(),
        token: ICO_TOKEN,
      };

      return token;
    }
  } catch (error) {
    console.log(error);
  }
};

export const TOKEN_ICO_CONTRACT = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { ethereum } = window;

    if (ethereum) {
      const signer = provider.getSigner();

      const contractReader = new ethers.Contract(
        TOKEN_ICO,
        TokenICO.abi,
        signer
      );

      // console.log("contractReader for token ICO", contractReader);

      return contractReader;
    }
  } catch (error) {
    console.log(error);
  }
};

//this is function to get the ERC20 ICO created token by me. Any one that call
//the function will get the information defined in the contract
export const TOKEN_ICO_ERC20 = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  try {
    if (ethereum) {
      const signer = provider.getSigner();

      const contractReader = new ethers.Contract(
        DEPOSIT_TOKEN,
        CustomTokenABI.abi,
        signer
      );

      //USER ADDRESS
      const userAddress = await signer.getAddress();
      const nativeBalance = await signer.getBalance();

      const token = {
        address: await contractReader.address,
        name: await contractReader.name(),
        symbol: await contractReader.symbol(),
        decimals: await contractReader.decimals(),
        supply: toEth(await contractReader.totalSupply()),
        balance: toEth(await contractReader.balanceOf(userAddress)),
        contractTokenBalance: toEth(nativeBalance.toString()),
      };

      return token;
    }
  } catch (error) {
    console.log(error);
  }
};
