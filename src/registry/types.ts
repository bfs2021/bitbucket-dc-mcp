import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
export const moduleTypeSchema = z.enum(["tool", "resource", "prompt"]);
export const registerableModuleSchema = z.object({
    type: moduleTypeSchema,
    name: z.string(),
    description: z.string().optional(),
    register: z.function()
        .args(z.any())
        .returns(z.union([z.void(), z.promise(z.void())]))
});
export interface RegisterableModule {
    type: "tool" | "resource" | "prompt";
    name: string;
    description?: string;
    register: (server: McpServer) => void | Promise<void>;
}
export type ModuleLoadResult =
    | { success: true; name: string; type: string }
    | { success: false; name: string; error: unknown };
export function isRegisterableModule(module: unknown): module is RegisterableModule {
    const result = registerableModuleSchema.safeParse(module);
    return result.success;
}
