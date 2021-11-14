import { PublicKey } from "@solana/web3.js";
import Environment from "../../config/environments";
import { apiResult } from "../../utils/apiResult";
import { request } from "../../utils/request";
import { getConnection } from "../../protocols/spl/sys-account";
import { getError } from "../commons";
import { transferXsbToken } from "../../protocols/xsb";

const config = Environment.config;

const getTxInformation = async (tx) => {
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

    return {
      status: 1,
      sender,
      receiver,
      mint,
      amount,
      tokenProgram,
      signer,
      data,
    };
  } catch (error) {
    return {
      status: -1,
      error: getError(error),
    };
  }
};

const checkTx = (txInfo) => {
  const { receiver, mint } = txInfo;

  // USDC
  if (mint !== "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") return false;
  // HOT WALLET
  if (receiver !== "Br6mLbY6ZapXFdayxfvz7P738GifvEz4s8EeFL6KsrzW") return false;

  return true;
};

class PurchaseController {
  async verify(req, res) {
    const body = req.body;
    const { tx } = body;
    console.log("tx", tx);

    try {
      const txInfo = await getTxInformation(tx);
      console.log("txInfo", txInfo);

      if (txInfo.status === 1) {
        return apiResult(res, 200, {
          ...txInfo,
          name: "purchase-verify",
          input: body,
          status: 1,
        });
      }
    } catch (error) {
      return apiResult(res, 400, {
        name: "purchase-verify",
        error: getError(error),
        input: body,
        status: -1,
      });
    }

    return apiResult(res, 400, {
      name: "purchase-verify",
      input: body,
      status: -1,
      error: "Server error, plz try again.",
    });
  }

  async submit(req, res) {
    const body = req.body;
    const { solAddress, signature, qty, value, recipient } = body;
    console.log("check mission: body", body);

    try {
      const purchase = await request({
        method: "post",
        path: "/purchases",
        data: {
          sol_address: solAddress,
          signature,
          qty,
          value,
          market: "XSBUSDC",
          recipient,
          status: "new",
          source: body,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      });
      return apiResult(res, 200, {
        name: "purchase-submit",
        input: body,
        status: 1,
        purchase,
      });
    } catch (error) {
      return apiResult(res, 400, {
        name: "purchase-submit",
        input: body,
        error: getError(error),
        status: -1,
      });
    }
  }

  async distribute(req, res) {
    const body = req.body;
    const { tx } = body;
    console.log("check mission: body", body);

    try {
      const purchase = await request({
        method: "get",
        path: `/purchases?signature=${tx}`,
      });

      if (purchase.length) {
        const item = purchase[0];

        if (item.status !== "new") {
          return apiResult(res, 400, {
            status: -1,
            name: "purchase-distribute",
            input: body,
            error: "Your request is processed",
          });
        }

        const txInfo = await getTxInformation(tx);
        const isValid = checkTx(txInfo);
        if (!isValid) {
          return apiResult(res, 400, {
            status: -1,
            name: "purchase-distribute",
            input: body,
            error: "Your TX is invalid",
          });
        }

        const usdcAmount = txInfo.amount;
        const xsbAmount = Math.ceil(usdcAmount / 0.0075);
        let releaseSignature = "";
        let releaseSignatureError = "";

        releaseSignature = await transferXsbToken(
          txInfo.signer,
          xsbAmount
        ).catch((error) => {
          releaseSignatureError = error;
        });
        console.log("releaseSignature", releaseSignature);

        if (releaseSignature) {
          const updatedPurchase = await request({
            method: "put",
            path: `/purchases/${item.id}`,
            data: {
              status: "completed",
              release_signature: releaseSignature,
              released_at: Date.now(),
              release_note: {
                usdcAmount,
                xsbAmount,
                txInfo,
                releaseSignatureError,
                purchase: item,
              },
            },
          });

          return apiResult(res, 200, {
            status: 1,
            name: "purchase-distribute",
            input: body,
            purchase: updatedPurchase,
            releaseSignature,
            xsbAmount,
          });
        }
      }

      return apiResult(res, 400, {
        status: -1,
        name: "purchase-distribute",
        error: "Tx is invalid",
        input: body,
      });
    } catch (error) {
      return apiResult(res, 400, {
        status: -1,
        name: "purchase-distribute",
        error: getError(error),
        input: body,
      });
    }
  }
}

export default new PurchaseController();
