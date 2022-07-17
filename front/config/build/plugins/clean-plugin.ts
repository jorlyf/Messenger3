import { Plugin } from "esbuild";
import { rm } from "fs/promises";

export const cleanPlugin: Plugin = {
  name: "CleanPlugin",
  setup(build) {
    build.onStart(async () => {
      const outdir = build.initialOptions.outdir;
      try {
        if (outdir) {
          await rm(outdir, { recursive: true });
        }
      } catch (error) {
        console.log("CleanPlugin не смог очистить папку");
      }
    });
  }
}