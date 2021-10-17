export const apiResult = (res, statusCode = 200, payload) => {
  console.log("result", statusCode, payload);
  return res.status(statusCode).send(payload);
};
