import { beforeAll, describe, expect, mock, test } from "bun:test";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, initClient } from "#lib/client.js";
import type { ToolResult } from "#lib/errors.js";
import webhooksModule from "./webhooks.js";

type Handler = (args: Record<string, unknown>) => ToolResult | Promise<ToolResult>;
const handlers = new Map<string, Handler>();

beforeAll(() => {
    initClient({ baseUrl: "http://bitbucket.invalid/rest/api/latest", token: "t", username: undefined, password: undefined, defaultProject: undefined, enableDangerous: false, timeoutMs: 30_000 });
    const fakeServer = {
        registerTool: (name: string, _config: unknown, handler: Handler) => handlers.set(name, handler),
    } as unknown as McpServer;
    webhooksModule.register(fakeServer);
});

const client = () => getClient() as unknown as Record<string, unknown>;

describe("listRepositoryWebhooks URL building", () => {
    test("encodes project key and repo slug", async () => {
        const fn = mock(() => Promise.resolve({ data: { values: [] } }));
        const original = client().get;
        client().get = fn;
        try {
            const handler = handlers.get("listRepositoryWebhooks");
            if (handler === undefined) throw new Error("listRepositoryWebhooks not registered");
            await handler({ projectKey: "../other", repoSlug: "re/po?" });
        }
        finally {
            client().get = original;
        }
        expect((fn.mock.calls[0] as unknown[])[0]).toBe("http://bitbucket.invalid/rest/webhooks/1.0/projects/..%2Fother/repos/re%2Fpo%3F/webhooks");
    });
});
