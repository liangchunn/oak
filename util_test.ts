// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal, assertThrows } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import httpErrors from "./httpError.ts";
import { decodeComponent, resolvePath } from "./util.ts";

test(function testDecodeComponent() {
  // with decodeURIComponent, this would throw:
  equal(decodeComponent("%"), "%");
});

test(function testResolvePath() {
  equal(resolvePath("./foo/bar"), `${Deno.cwd()}/foo/bar`);
});

test(function testResolvePathOutsideOfRoot() {
  assertThrows(() => {
    resolvePath("../foo/bar");
  }, httpErrors.Forbidden);
});

test(function testResolvePathOutsideOfRootDevious() {
  assertThrows(() => {
    resolvePath("foo/../../bar");
  }, httpErrors.Forbidden);
});

test(function testResolvePathAbsolute() {
  assertThrows(
    () => {
      resolvePath("/dev/null");
    },
    httpErrors.BadRequest,
    "Malicious Path"
  );
});

test(function testResolvePathContainsNull() {
  assertThrows(
    () => {
      resolvePath("./foo/bar\0baz");
    },
    httpErrors.BadRequest,
    "Malicious Path"
  );
});

test(function testResolvePathRoot() {
  equal(resolvePath("/public", "./foo/bar"), "/public/foo/bar");
});
