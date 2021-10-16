export default class Config {
  constructor() {
    this.config.PORT = process.env.PORT || "3000";
    this.config.API_ROOT_PATH = process.env.PORT || "api";
    this.config.DB_URL = process.env.DB_URL;
    this.config.JWT_TOKEN_SECRECT = process.env.JWT_TOKEN_SECRECT || null;
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
