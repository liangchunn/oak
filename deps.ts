// Copyright 2018-2019 the oak authors. All rights reserved. MIT license.

// This file contains the external dependencies that oak depends upon

export {
  Response,
  serve,
  ServerRequest
} from "https://deno.land/std@v0.3.4/http/server.ts";
export {
  Status,
  STATUS_TEXT
} from "https://deno.land/std@v0.3.4/http/http_status.ts";
export {
  basename,
  extname,
  join,
  isAbsolute,
  normalize,
  parse,
  resolve,
  sep
} from "https://deno.land/std@v0.3.4/fs/path/mod.ts";
export {
  contentType,
  lookup
} from "https://deno.land/std@v0.3.4/media_types/mod.ts";
