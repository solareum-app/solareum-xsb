import Environment from "../../config/environments";
import { apiResult } from "../../utils/apiResult";
import { request } from "../../utils/request";
import { getError } from "../commons";

const config = Environment.config;

class WalletController {
  async new(req, res) {
    const body = req.body;
    const { solAddress, refAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("register device: body", body);

    try {
      const wallet = await request({
        method: "post",
        path: "/wallets",
        data: {
          sol_address: solAddress,
          nominated_by: refAddress,
          device_id: deviceId,
          source: body,
          created_at: Date.now(),
        },
      });

      return apiResult(res, 200, {
        name: "wallet-new",
        input: body,
        wallet,
      });
    } catch (error) {
      return apiResult(res, 400, {
        name: "wallet-new",
        input: body,
        error: getError(error),
      });
    }
  }

  async update(req, res) {
    const body = req.body;
    const { solAddress, refAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("update device: body", body);

    try {
      const list = await request({
        method: "get",
        path: `/wallets?sol_address=${solAddress}`,
      });
      const walletId = list.length ? list[0].id : "";

      let wallet = {};
      if (walletId) {
        wallet = await request({
          method: "put",
          path: `/wallets/${walletId}`,
          data: {
            sol_address: solAddress,
            nominated_by: refAddress,
            device_id: deviceId,
            source: body,
            updated_at: Date.now(),
          },
        });
      }

      return apiResult(res, 200, {
        name: "wallet-update",
        input: body,
        wallet,
      });
    } catch (error) {
      return apiResult(res, 400, {
        name: "wallet-update",
        input: body,
        error: getError(error),
      });
    }
  }
}

export default new WalletController();
