import express from "express";
import ExampleController from "./controllers/ExampleController";
import test1Controller from "./controllers/test1Controller";
import test2Controller from "./controllers/test2Controller";
import test5Controller from "./controllers/test5Controller";
import bodyParser from "body-parser";
import { NotFound } from "./utils/routeHelpers";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", ExampleController.routes());
app.use("/test1", test1Controller.routes());
app.use("/test2", test2Controller.routes());
app.use("/test5", test5Controller.routes());
app.use(NotFound);
export default app;
