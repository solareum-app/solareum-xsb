import { apiResult } from "../../utils/apiResult";
import { request } from "../../utils/request";
import { transferXsbToken } from "../../protocols/xsb";
import Environment from "../../config/environments";
import { logRequest } from "../commons";

const config = Environment.config;

const checkMissionLeft = async (solAddress, deviceId) => {
  // 86400000 = 1 day
  const last24h = Date.now() - 86400000;
  const airdropList = await request({
    method: "get",
    path: `/airdrops?sol_address=${solAddress}&type=mission&created_at_gte=${last24h}`,
  });
  // since the airdrop is so big, so one device receive 1 airdrop
  // considider to disable this rules then
  const deviceList = await request({
    method: "get",
    path: `/airdrops?device_id=${deviceId}&type=mission&created_at_gte=${last24h}`,
  });

  return (
    config.MISSION_PER_DAY - Math.max(airdropList.length, deviceList.length)
  );
};

class AirdropController {
  async check(req, res) {
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("check mission: body", body);
    console.log("check mission: solAddress, deviceId", solAddress, deviceId);

    const missionLeft = await checkMissionLeft(solAddress, deviceId);

    return apiResult(res, 200, {
      input: body,
      currency: "XSB",
      missionLeft: missionLeft,
      missionReward: config.REWARD_MISSION,
      missionPerDay: config.MISSION_PER_DAY,
    });
  }

  async get(req, res) {
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("airdrop: body", body);
    console.log("mission: solAddress, deviceId", solAddress, deviceId);

    let missionRewardSignature = null;
    let missionRewardError = null;

    try {
      const missionLeft = await checkMissionLeft(solAddress, deviceId);

      if (missionLeft > 0) {
        missionRewardSignature = await transferXsbToken(
          solAddress,
          config.REWARD_MISSION
        ).catch((error) => {
          missionRewardError = error;
        });

        await logRequest(
          solAddress,
          config.REWARD_MISSION,
          "mission",
          missionRewardSignature,
          config.XSB_ACCOUNT,
          deviceId,
          {
            ...body,
            missionRewardError,
          }
        );
      } else {
        missionRewardError = `You have done ${config.MISSION_PER_DAY} missions today, plz try again tomorrow.`;
      }
    } catch (error) {
      missionRewardError = error;
    }

    return apiResult(res, 200, {
      input: body,
      missionRewardSignature,
      missionReward: missionRewardSignature ? config.REWARD_MISSION : 0,
      missionPerDay: config.MISSION_PER_DAY,
      missionRewardError,
    });
  }
}

export default new AirdropController();
