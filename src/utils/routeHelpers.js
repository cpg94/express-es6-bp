const RouteError = (res, message) =>
  res.status(500).send({
    status: "error",
    message: message
  });

const NotFound = (req, res) =>
  res.status(404).send({
    message: "Not found"
  });

export {
    RouteError,
    NotFound,
}