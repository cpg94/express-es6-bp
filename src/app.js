import express from "express";
import ExampleController from './controllers/ExampleController';
const app = express();

// Define Middleware and routes here;
app.use('/', ExampleController.routes());

export default app;