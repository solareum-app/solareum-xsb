import Environment from "../../config/environments";
import { apiResult } from "../../utils/apiResult";
import { getConnection } from "../../protocols/spl/sys-account";
import { getError } from "../commons";
import { PublicKey } from "@solana/web3.js";

const config = Environment.config;

class PurchaseController {
  async verify(req, res) {
    const body = req.body;
    const { tx } = body;
    console.log("tx", tx);

    try {
      const connection = getConnection();
      const data = await connection.getTransaction(tx);
      console.log("data", data);

      const pre = data.meta.preTokenBalances[1];
      const post = data.meta.postTokenBalances[1];
      const amount = post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount;
      const mint = data.meta.postTokenBalances[1].mint;
      const signer = new PublicKey(
        data.transaction.message.accountKeys[0]
      ).toBase58();
      const sender = new PublicKey(
        data.transaction.message.accountKeys[1]
      ).toBase58();
      const receiver = new PublicKey(
        data.transaction.message.accountKeys[2]
      ).toBase58();
      const tokenProgram = new PublicKey(
        data.transaction.message.accountKeys[3]
      ).toBase58();

      return apiResult(res, 200, {
        name: "purchase-verify",
        sender,
        receiver,
        mint,
        amount,
        tokenProgram,
        signer,
        input: body,
        data,
      });
    } catch (error) {
      return apiResult(res, 400, {
        name: "purchase-verify",
        error: getError(error),
        input: body,
      });
    }
  }

  async submit(req, res) {
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("check mission: body", body);
    console.log("check mission: solAddress, deviceId", solAddress, deviceId);

    return apiResult(res, 200, {
      name: "purchase-submit",
      input: body,
    });
  }

  async distribute(req, res) {
    const body = req.body;
    console.log("check mission: body", body);

    return apiResult(res, 200, {
      name: "purchase-distribute",
      input: body,
    });
  }
}

export default new PurchaseController();
