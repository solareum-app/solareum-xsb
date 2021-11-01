import { request } from "../utils/request";

export const getError = (error) => {
  if (typeof error === "string") {
    return error;
  }
  delete error.config;
  return error;
};

export const genLog = async (type, payload = {}) => {
  const { solAddress, refAddress } = payload;

  return await request({
    method: "post",
    path: "/airdrop-logs",
    data: {
      type,
      payload,
      sol_address: solAddress || "-",
      ref_address: refAddress || "-",
      created_at: Date.now(),
    },
  }).catch((error) => {
    console.log("genLog", error);
    return -1;
  });
};

export const logRequest = async (
  solAddress,
  value = 0,
  type = "airdrop",
  signature,
  sendingAccount,
  deviceId,
  source
) => {
  return await request({
    method: "post",
    path: "/airdrops",
    data: {
      sol_address: solAddress,
      value: value,
      type,
      signature,
      sending_account: sendingAccount,
      device_id: deviceId,
      source,
      created_at: Date.now(),
    },
  });
};
