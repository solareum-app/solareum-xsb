import { apiResult } from "../../utils/apiResult";
import Environment from "../../config/environments";

const config = Environment.config;

class DeviceController {
  async register(req, res) {
    const body = req.body;
    const { solAddress, meta = {} } = body;
    const deviceId = meta.deviceId;

    console.log("check mission: body", body);
    console.log("check mission: solAddress, deviceId", solAddress, deviceId);

    return apiResult(res, 200, {
      input: body,
      name: "device-register",
    });
  }
}

export default new DeviceController();
