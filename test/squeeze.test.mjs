import test from "node:test";
import assert from "node:assert/strict";
import { squeeze, serialize, capText } from "../build/lib/squeeze.js";
import { jsonResult } from "../build/lib/errors.js";

test("drops links, avatars, nulls and empty containers but keeps false/0 and empty values", () => {
    const out = squeeze({ id: 0, ok: false, links: { self: [] }, a: null, b: [], c: "", user: { avatarUrl: "x", name: "n" }, values: [] });
    assert.deepEqual(out, { id: 0, ok: false, user: { name: "n" }, values: [] });
});
test("compact JSON by default, pretty when verbose", () => {
    assert.equal(serialize({ a: 1, links: {} }), '{"a":1}');
    process.env.BITBUCKET_VERBOSE = "true";
    assert.match(serialize({ a: 1, links: {} }), /\n/);
    delete process.env.BITBUCKET_VERBOSE;
});
test("caps long text and says how to raise the cap", () => {
    process.env.BITBUCKET_MAX_CHARS = "10";
    assert.match(capText("x".repeat(25)), /^xxxxxxxxxx\n\[truncated 15 of 25 chars/);
    delete process.env.BITBUCKET_MAX_CHARS;
});
test("jsonResult routes through the squeeze", () => {
    assert.equal(jsonResult({ a: 1, links: {} }).content[0].text, '{"a":1}');
});
