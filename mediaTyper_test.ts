// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assertStrictEq, assertThrows } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { format, parse } from "./mediaTyper.ts";

test(function formatBasicType() {
  const actual = format({ type: "text", subtype: "html" });
  assertStrictEq(actual, "text/html");
});

test(function formatWithSuffix() {
  const actual = format({ type: "image", subtype: "svg", suffix: "xml" });
  assertStrictEq(actual, "image/svg+xml");
});

test(function invalidType() {
  assertThrows(
    () => {
      format({ type: "text/", subtype: "html" });
    },
    TypeError,
    "Invalid type"
  );
});

test(function invalidSubType() {
  assertThrows(
    () => {
      format({ type: "text", subtype: "html/" });
    },
    TypeError,
    "Invalid subtype"
  );
});

test(function invalidSubType() {
  assertThrows(
    () => {
      format({ type: "image", subtype: "svg", suffix: "xml\\" });
    },
    TypeError,
    "Invalid suffix"
  );
});

test(function parseBasicType() {
  const actual = parse("text/html");
  equal(actual, { type: "text", subtype: "html", suffix: undefined });
});

test(function parseWithSuffix() {
  const actual = parse("image/svg+xml");
  equal(actual, { type: "image", subtype: "svg", suffix: "xml" });
});

test(function parseLowerCase() {
  const actual = parse("IMAGE/SVG+XML");
  equal(actual, { type: "image", subtype: "svg", suffix: "xml" });
});

const invalidTypes = [
  " ",
  "null",
  "undefined",
  "/",
  "text/;plain",
  'text/"plain"',
  "text/p£ain",
  "text/(plain)",
  "text/@plain",
  "text/plain,wrong"
];

for (const type of invalidTypes) {
  test({
    name: `invalidType: "${type}"`,
    fn() {
      assertThrows(
        () => {
          parse(type);
        },
        TypeError,
        "Invalid media type"
      );
    }
  });
}
