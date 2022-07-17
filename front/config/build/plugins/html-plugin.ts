import path from "path";
import { Plugin } from "esbuild";
import { writeFile } from "fs/promises";

interface HTMLPluginOptions {
  template?: string;
  title?: string;
  jsPath?: string[];
  cssPath?: string[];
  someScript?: string;
}

const renderHtml = (options: HTMLPluginOptions) => {
  return (options.template || `<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <title>${options.title}</title>${options.cssPath?.map(path => `<link href="${path}" rel="stylesheet"></link>`).join(" ")}
  </head>

  <body>
    <div id="root"></div>
  </body>

  ${options.jsPath?.map(path => `<script src="${path}"></script>`).join(" ")}

  ${options.someScript}

</html>`
  )
}

const preparePaths = (outputs: string[]) => {
  return outputs.reduce<Array<string[]>>((acc, path) => {
    const [js, css] = acc;
    const splittedFilename = path.split("/").pop();

    if (splittedFilename?.endsWith(".js")) {
      js.push(splittedFilename);
    }
    if (splittedFilename?.endsWith(".css")) {
      css.push(splittedFilename);
    }

    return acc;
  }, [[], []]);
}

export const htmlPlugin = (options: HTMLPluginOptions): Plugin => {
  return {
    name: "HTMLPlugin",
    setup(build) {
      const outdir = build.initialOptions.outdir;
      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs;
        const [jsPath, cssPath] = preparePaths(Object.keys(outputs || {}));

        if (outdir) {
          await writeFile(
            path.resolve(outdir, "index.html"),
            renderHtml({ jsPath, cssPath, ...options })
          );
        }
      });
    }
  };
}