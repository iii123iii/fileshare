import { createRouteHandler } from "uploadthing/next";

import { fileShareFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: fileShareFileRouter,
});
