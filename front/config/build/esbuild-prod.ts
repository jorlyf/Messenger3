import ESBuild from "esbuild";
import config from "./esbuild-config";

ESBuild.build(config)
  .catch(error => console.log(error));