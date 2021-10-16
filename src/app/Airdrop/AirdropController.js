class AirdropController {
  check(req, res) {
    res.status(200).send({ status: "ok" });
  }

  update() {}

  delete() {}
}

export default new AirdropController();
