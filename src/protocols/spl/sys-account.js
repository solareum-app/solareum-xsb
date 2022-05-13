import { Connection, Account, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "./lib/tokens/instructions";
import { parseTokenAccountData } from "./lib/tokens/data";

const CLUSTER = process.env.CLUSTER;

// SOLAREUM HOT WALLET
const secretKey = JSON.parse(process.env.WALLET);

export const getAccount = () => {
  return new Account(secretKey);
};

export const getConnection = () => {
  const connection = new Connection(CLUSTER);
  return connection;
};

export const getAccountBalance = async (address) => {
  const connection = getConnection();
  const publicKey = new PublicKey(address);
  const accountInfo = await connection.getAccountInfo(publicKey);
  let { amount } = accountInfo.owner.equals(TOKEN_PROGRAM_ID)
    ? parseTokenAccountData(accountInfo.data)
    : {};
  return amount || 0;
};

export const getBalance = async (address) => {
  const connection = getConnection();
  const publicKey = new PublicKey(address);
  return await connection.getBalance(publicKey);
};
