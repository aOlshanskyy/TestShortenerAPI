import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getLink, incrementClicks, saveLink } from "../store.js";

const shortenBodySchema = z.object({
  url: z.string().url(),
});

export async function shortenRoutes(app: FastifyInstance) {
  app.post("/shorten", async (request, reply) => {
    const parsed = shortenBodySchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: "Invalid URL",
        details: parsed.error.flatten(),
      });
    }

    const code = nanoid(7);
    const link = {
      code,
      url: parsed.data.url,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    saveLink(link);

    return reply.status(201).send({
      code: link.code,
      shortUrl: `http://localhost:3000/${link.code}`,
      url: link.url,
    });
  });

  app.get<{ Params: { code: string } }>("/stats/:code", async (request, reply) => {
    const link = getLink(request.params.code);

    if (!link) {
      return reply.status(404).send({ error: "Not found" });
    }

    return {
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      createdAt: link.createdAt,
    };
  });

  app.get<{ Params: { code: string } }>("/:code", async (request, reply) => {
    const updated = incrementClicks(request.params.code);

    if (!updated) {
      return reply.status(404).send({ error: "Not found" });
    }

    return reply.redirect(updated.url);
  });
}