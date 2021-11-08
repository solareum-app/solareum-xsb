import { apiResult } from "../../utils/apiResult";
import { request } from "../../utils/request";
import { transferXsbToken } from "../../protocols/xsb";
import Environment from "../../config/environments";
import { genLog, logRequest } from "../commons";

const config = Environment.config;

// sending account
const mintAccount = process.env.XSB_ACCOUNT;
// airdrop to receiver who complete the tasks
const rewardAirdrop = parseFloat(process.env.REWARD_AIRDROP);
// airdrop to referer who introduce the app to others
const rewardRef = parseFloat(process.env.REWARD_REF);

const checkValidAddress = async (solAddress, deviceId) => {
  if (!solAddress || !deviceId) return false;

  try {
    const airdropList = await request({
      method: "get",
      path: `/airdrops?sol_address=${solAddress}&type=airdrop`,
    });
    // since the airdrop is so big, so one device receive 1 airdrop
    // considider to disable this rules then
    const deviceList = await request({
      method: "get",
      path: `/airdrops?device_id=${deviceId}&type=airdrop`,
    });

    return airdropList.length === 0 && deviceList.length === 0;
  } catch {
    return false;
  }
};

class AirdropController {
  async check(req, res) {
    const params = {};
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;
    console.log("checkAirdrop: params", params);
    console.log("checkAirdrop: body", body);
    console.log("checkAirdrop: solAddress, deviceId", solAddress, deviceId);

    const valid = await checkValidAddress(solAddress, deviceId);

    if (valid && rewardAirdrop !== 0) {
      return apiResult(res, 200, {
        status: 1,
        params,
        body,
        rewardAirdrop,
        rewardRef,
      });
    }

    return apiResult(res, 200, {
      status: -1,
      params,
      body,
      rewardAirdrop: 0,
      rewardRef,
    });
  }

  async get(req, res) {
    const params = {};
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;
    let refAddress = "";

    // ref address will be tracked from our database
    const walletList = await request({
      method: "get",
      path: `/wallets?sol_address=${solAddress}`,
    });
    if (walletList.length) {
      refAddress = walletList[0].nominated_by;
    }

    console.log("airdrop: params", params);
    console.log("airdrop: body", body);
    console.log(
      "airdrop: solAddress, refAddress, deviceId",
      solAddress,
      refAddress,
      deviceId
    );

    if (rewardAirdrop === 0) {
      return apiResult(res, 400, {
        status: -1,
        params,
        input: body,
        rewardAirdrop: 0,
        rewardRef: 0,
        error: "Airdrop is disabled temporarily",
      });
    }

    await genLog("airdrop", body);
    const valid = await checkValidAddress(solAddress, deviceId);

    if (!valid) {
      return apiResult(res, 400, {
        status: -1,
        params,
        input: body,
        rewardAirdrop: 0,
        rewardRef: 0,
        error: "Addresses are not qualified, plz change your referral address.",
      });
    }

    let rewardAirdropSignature = "";
    let rewardRefSignature = "";
    let rewardAirdropSignatureError = "";
    let rewardRefSignatureError = "";
    let logAirdrop = {};
    let logRef = {};

    try {
      // TODO
      // let rewardAirdropSignatureError = 'Your address is not qualified.';
      // let rewardRefSignatureError = 'Your address is not qualified.';

      if (rewardAirdrop) {
        rewardAirdropSignature = await transferXsbToken(
          solAddress,
          rewardAirdrop
        ).catch((error) => {
          rewardAirdropSignatureError = error;
        });
        // log the success airdrop
        if (rewardAirdropSignature) {
          logAirdrop = await logRequest(
            solAddress,
            rewardAirdrop,
            "airdrop",
            rewardAirdropSignature,
            mintAccount,
            deviceId,
            body
          ).catch(() => null);
        }
      }

      if (rewardRef && rewardAirdropSignature) {
        if (solAddress !== refAddress) {
          rewardRefSignature = await transferXsbToken(
            refAddress,
            rewardRef
          ).catch((error) => {
            rewardRefSignatureError = error;
          });
          // log the success airdrop
          if (rewardRefSignature) {
            logRef = await logRequest(
              refAddress,
              rewardRef,
              "referral",
              rewardRefSignature,
              mintAccount,
              deviceId,
              body
            ).catch(() => null);
          }
        } else {
          rewardRefSignature = "Ref address is not qualified.";
        }
      }

      return apiResult(res, 200, {
        status: 1,
        params,
        input: body,
        rewardAirdrop: rewardAirdropSignature ? rewardAirdrop : 0,
        rewardRef: rewardRefSignature ? rewardRef : 0,
        rewardAirdropSignature,
        rewardRefSignature,
        rewardAirdropSignatureError,
        rewardRefSignatureError,
        logAirdrop,
        logRef,
      });
    } catch (error) {
      return apiResult(res, 500, {
        status: -1,
        params,
        input: body,
        rewardAirdrop: rewardAirdropSignature ? rewardAirdrop : 0,
        rewardRef: rewardRefSignature ? rewardRef : 0,
        rewardAirdropSignature,
        rewardRefSignature,
        rewardAirdropSignatureError,
        rewardRefSignatureError,
        logAirdrop,
        logRef,
        error,
      });
    }
  }
}

export default new AirdropController();
