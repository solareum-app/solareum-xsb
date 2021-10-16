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
    this.config.REWARD_AIRDROP = process.env.REWARD_AIRDROP;
    this.config.REWARD_REF = process.env.REWARD_REF;
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
