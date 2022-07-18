import ESBuild from "esbuild";
import config from "./esbuild-config";
import express from "express";
import path from "path";
import { EventEmitter } from "events";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const emitter = new EventEmitter();

//app.use(express.static(path.resolve(__dirname, "..", "..", "build")));

const getExtension = (fileName: string) => (
  fileName.substr(fileName.lastIndexOf(".") + 1)
)

app.get("/subscribe", (req, res) => {
  emitter.removeAllListeners("refresh");
  
  const headers = {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  }

  res.writeHead(200, headers);
  res.write("");

  emitter.on("refresh", () => {
    res.write("data: message\n\n");
  });
});

app.get("*", ({ url }, res) => {
  let filePath;
  if (["js", "css", "png", "jpg", "map"].includes(getExtension(url))) {
    filePath = path.resolve(__dirname, "..", "..", "build") + url;
  } else {
    filePath = path.resolve(__dirname, "..", "..", "build") + "/index.html";
  }
  res.sendFile(filePath);
});

app.listen(PORT,
  () => {
    console.log(`Server started on port = ${PORT}`);
  }
);

const sendMessage = () => {
  emitter.emit("refresh", "message");
}

ESBuild.build({
  ...config,
  watch: {
    onRebuild(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("rebuilded...");
        sendMessage();
      }
    }
  }
})
  .then(result => {

  })
  .catch(error => {
    console.log(error);
  });