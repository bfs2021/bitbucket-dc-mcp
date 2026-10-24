import { beforeAll, describe, expect, mock, test } from "bun:test";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClient, initClient } from "#lib/client.js";
import type { ToolResult } from "#lib/errors.js";
import branchesModule from "./branches.js";

type Handler = (args: Record<string, unknown>) => ToolResult | Promise<ToolResult>;
const handlers = new Map<string, Handler>();

beforeAll(() => {
    initClient({ baseUrl: "http://bitbucket.invalid/rest/api/latest", token: "t", username: undefined, password: undefined, defaultProject: undefined, enableDangerous: true, timeoutMs: 30_000 });
    const fakeServer = {
        registerTool: (name: string, _config: unknown, handler: Handler) => handlers.set(name, handler),
    } as unknown as McpServer;
    branchesModule.register(fakeServer);
});

const client = () => getClient() as unknown as Record<string, unknown>;

describe("deleteBranch URL building", () => {
    test("encodes project key and repo slug in the branch-utils path", async () => {
        const fn = mock(() => Promise.resolve({ data: {} }));
        const original = client().delete;
        client().delete = fn;
        try {
            const handler = handlers.get("deleteBranch");
            if (handler === undefined) throw new Error("deleteBranch not registered");
            await handler({ projectKey: "../other", repoSlug: "re/po?", name: "feature/x", dryRun: true });
        }
        finally {
            client().delete = original;
        }
        expect((fn.mock.calls[0] as unknown[])[0]).toBe("http://bitbucket.invalid/rest/branch-utils/latest/projects/..%2Fother/repos/re%2Fpo%3F/branches");
    });
});
