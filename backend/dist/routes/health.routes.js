"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRouter = (0, express_1.Router)();
healthRouter.get("/", (request, response) => {
    response.json({
        status: "ok",
        service: "SuperMarket ERP API",
        timestamp: new Date().toISOString(),
    });
});
exports.default = healthRouter;
