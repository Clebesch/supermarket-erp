import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (request, response) => {
  response.json({
    status: "ok",
    service: "SuperMarket ERP API",
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;