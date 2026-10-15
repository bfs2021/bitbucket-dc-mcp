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
export function isRegisterableModule(module) {
    const result = registerableModuleSchema.safeParse(module);
    return result.success;
}
//# sourceMappingURL=types.js.map