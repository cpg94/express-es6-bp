import express from "express";
import bodyParser from "body-parser";
import ExampleController from './controllers/ExampleController';
import { NotFound } from './utils/routeHelpers';
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', ExampleController.routes());
app.use(NotFound);

export default app;