import dotenv from "dotenv";
dotenv.config();

export default class Config {
  constructor() {
    this.config.PORT = process.env.PORT || "3000";
    this.config.API_ROOT_PATH = process.env.PORT || "api";
    this.config.DB_URL = process.env.DB_URL;
    this.config.JWT_TOKEN_SECRECT = process.env.JWT_TOKEN_SECRECT || null;

    this.config.CLUSTER_NAME = process.env.CLUSTER_NAME;
    this.config.CLUSTER = process.env.CLUSTER;
    this.config.API_PATH = process.env.API_PATH;
    this.config.CROSS_COMMUNICATION_KEY = process.env.CROSS_COMMUNICATION_KEY;

    this.config.REWARD_AIRDROP = parseFloat(process.env.REWARD_AIRDROP || "0");
    this.config.REWARD_REF = parseFloat(process.env.REWARD_REF || "0");
    this.config.REWARD_MISSION = parseFloat(process.env.REWARD_MISSION || "0");
    this.config.MISSION_PER_DAY = parseInt(
      process.env.MISSION_PER_DAY || "0",
      10
    );

    // Airdrop
    this.config.AIRDROP_1 = parseFloat(process.env.AIRDROP_1 || "0");
    this.config.AIRDROP_2 = parseFloat(process.env.AIRDROP_2 || "0");
    this.config.AIRDROP_3 = parseFloat(process.env.AIRDROP_3 || "0");
    this.config.AIRDROP_4 = parseFloat(process.env.AIRDROP_4 || "0");

    // Ref
    this.config.REF_1 = parseFloat(process.env.REF_1 || "0");
    this.config.REF_2 = parseFloat(process.env.REF_2 || "0");
    this.config.REF_3 = parseFloat(process.env.REF_3 || "0");
    this.config.REF_4 = parseFloat(process.env.REF_4 || "0");

    this.config.XSB_TOKEN_ADDRESS = process.env.XSB_TOKEN_ADDRESS;
    this.config.XSB_ACCOUNT = process.env.XSB_ACCOUNT;
    this.config.WALLET = process.env.WALLET;
  }

  set config(env) {
    this.config.PORT = env.PORT || "3000";
    this.config.API_ROOT_PATH = env.PORT || "api";
    this.config.DB_URL = env.DB_URL;
    this.config.JWT_TOKEN_SECRECT = null;
  }

  get config() {
    return this;
  }
}
