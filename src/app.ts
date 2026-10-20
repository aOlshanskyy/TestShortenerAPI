import Fastify from "fastify";
import { shortenRoutes } from "./routes/shorten.js";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(shortenRoutes);
  return app;
}