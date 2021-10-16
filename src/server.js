import Environment from "./config/environments";
import Express from "./config/express-middleware";

let serverInstace = null;
const config = Environment.config;

export default new (class Server extends Express {
  constructor() {
    console.info(config);
    super(config);
    const port = config.PORT;

    if (!serverInstace) {
      this.app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
      );
      serverInstace = "serverInstace";
    }
  }

  expressApp() {
    return this.app;
  }
})();
