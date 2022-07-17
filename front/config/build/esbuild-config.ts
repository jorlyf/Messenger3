import path from "path";
import { BuildOptions } from "esbuild";
import { cleanPlugin } from "./plugins/clean-plugin";
import { htmlPlugin } from "./plugins/html-plugin";
import cssModulesPlugin from "esbuild-css-modules-plugin";

const rootPath = path.resolve(__dirname, "..", "..")

const mode = process.env.mode || "development";
const PORT = Number(process.env.PORT) || 3000;

const isDev = mode === "development";
const isProd = mode === "production";

const getExpressConnectionScript = (): string => {
  if (isProd) return "";

  return `<script>
  const evtSource = new EventSource("http://localhost:${PORT}/subscribe");
  evtSource.onerror = () => { console.log("error on express server"); }
  evtSource.onmessage = () => { window.location.reload(); }
  </script>`;
}

const config: BuildOptions = {
  outdir: `${rootPath}\\build`,
  entryPoints: [`${rootPath}\\src\\index.tsx`],
  entryNames: "[dir]\\bundle-[hash]",
  allowOverwrite: true,
  minify: isProd,
  bundle: true,
  sourcemap: isDev,
  tsconfig: `${rootPath}\\tsconfig.json`,
  loader: {
    ".png": "file",
    ".svg": "file",
    ".jpg": "file"
  },
  metafile: true,
  plugins: [
    cleanPlugin,
    cssModulesPlugin({
      inject: false,

      localsConvention: 'camelCaseOnly',

      // cssModulesOption: {
      //   generateScopedName: (name, filename, css) => `[path][name]__[local]___[hash:base64:8]`
      // },

      v2: true,
      v2CssModulesOption: {
        dashedIndents: false,
        pattern: `[name]_[local]_[hash]`
      }
    }),
    htmlPlugin({
      title: "Messanger",
      someScript: getExpressConnectionScript()
    })
  ]
}

export default config;