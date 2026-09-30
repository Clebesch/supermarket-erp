import express from "express";
import healthRouter from "./routes/health.routes.js";

const app = express();

const PORT = 3000;

app.use(express.json());

// Rota principal.
app.get("/", (request, response) => {
  response.json({
    message: "SuperMarket ERP API",
    status: "online",
  });
});

// Health check da API.
app.use("/api/health", healthRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado em http://localhost:${PORT}`);
});