import { Connection, Account, PublicKey } from "@solana/web3.js";

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

export const getAccountInfo = async (address) => {
  const connection = getConnection();
  const publicKey = new PublicKey(address);
  return await connection.getAccountInfo(publicKey);
};

export const getBalance = async (address) => {
  const connection = getConnection();
  const publicKey = new PublicKey(address);
  return await connection.getBalance(publicKey);
};
