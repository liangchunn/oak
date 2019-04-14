// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.
import { test } from "https://deno.land/std@v0.3.4/testing/mod.ts";
import { equal } from "https://deno.land/std@v0.3.4/testing/asserts.ts";
import { preferredEncodings } from "./encoding.ts";

test(function encoding() {
  equal(preferredEncodings("gzip, compress;q=0.2, identity;q=0.5"), [
    "gzip",
    "identity",
    "compress"
  ]);
});

test(function availableEncoding() {
  equal(
    preferredEncodings("gzip, compress;q=0.2, identity;q=0.5", [
      "identity",
      "gzip"
    ]),
    ["gzip", "identity"]
  );
});
