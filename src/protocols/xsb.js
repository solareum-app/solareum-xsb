import { PublicKey } from '@solana/web3.js';

import { getAccount, getConnection } from '../protocols/spl/sys-account';
import { Wallet } from '../protocols/spl/lib/wallet';

const mintAddress = process.env.XSB_TOKEN_ADDRESS; // XSB token address
const mintAccount = process.env.XSB_ACCOUNT;

export const transferXsbToken = async (receiver, amount) => {
  console.log(
    'transferXsbToken: receiver, mintAddress, mintAccount',
    receiver,
    mintAddress,
    mintAccount,
  );

  const owner = getAccount();
  const wallet = new Wallet(getConnection(), 'custody', {
    account: owner,
  });
  const signature = await wallet.transferToken(
    new PublicKey(mintAccount),
    new PublicKey(receiver),
    amount * Math.pow(10, 9),
    new PublicKey(mintAddress),
  );

  return signature;
};
