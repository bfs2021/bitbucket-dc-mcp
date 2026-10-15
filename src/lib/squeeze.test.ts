import { afterEach, expect, test } from "bun:test";
import { squeeze, serialize, capText } from "./squeeze.js";
import { jsonResult } from "./errors.js";

afterEach(() => {
    delete process.env.BITBUCKET_VERBOSE;
    delete process.env.BITBUCKET_MAX_CHARS;
});

test("drops links, avatars, nulls and empty containers but keeps false/0 and empty values", () => {
    const out = squeeze({ id: 0, ok: false, links: { self: [] }, a: null, b: [], c: "", user: { avatarUrl: "x", name: "n" }, values: [] });
    expect(out).toEqual({ id: 0, ok: false, user: { name: "n" }, values: [] });
});
test("compact JSON by default, pretty when verbose", () => {
    expect(serialize({ a: 1, links: {} })).toBe('{"a":1}');
    process.env.BITBUCKET_VERBOSE = "true";
    expect(serialize({ a: 1, links: {} })).toMatch(/\n/);
    delete process.env.BITBUCKET_VERBOSE;
});
test("caps long text and says how to raise the cap", () => {
    process.env.BITBUCKET_MAX_CHARS = "10";
    expect(capText("x".repeat(25))).toMatch(/^xxxxxxxxxx\n\[truncated 15 of 25 chars/);
    delete process.env.BITBUCKET_MAX_CHARS;
});
test("jsonResult routes through the squeeze", () => {
    expect(jsonResult({ a: 1, links: {} }).content[0].text).toBe('{"a":1}');
});
