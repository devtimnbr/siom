import http from "http";
import sharp from "sharp";
import fetch from "node-fetch";

const host = "0.0.0.0";
const port = 8000;

const formatValues = ["jpeg", "png", "webp", "gif"];
const fitValues = ["cover", "contain", "fill", "inside", "outside"];
const positionValues = [
  "center",
  "top",
  "right top",
  "right",
  "right bottom",
  "bottom",
  "left bottom",
  "left",
  "left-top",
];

const isHexColor = /^#([0-9a-f]{3}){1,2}$/i;

const getParams = (params: URLSearchParams) => ({
  // external img url
  src: params.get("src"),
  // width
  w: params.get("w") ? Number(params.get("w")) : undefined,
  // height
  h: params.get("h") ? Number(params.get("h")) : undefined,
  // quality
  q: params.get("q") ? Number(params.get("q")) : undefined,
  // fit
  f: params.get("f") ? (params.get("f") as string) : "cover",
  // position
  p: params.get("p") ? (params.get("p") as string) : "center",
  // backroundColor
  bg: params.get("bg") ? "#" + (params.get("bg") as string) : "#000",
  // format
  format: params.get("format") ? (params.get("format") as string) : "webp",
});

const requestListener = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  let url = new URL(req.url as string, "http://" + host);
  let { src, w, h, q, f, p, bg, format } = getParams(url.searchParams);

  try {
    if (!src) {
      throw Error("No img in search parameters provided");
    }
    if (fitValues.indexOf(f) < 0) {
      throw Error("Invalid fit value in params");
    }

    if (positionValues.indexOf(p) < 0) {
      throw Error("Invalid position value in params");
    }

    if (formatValues.indexOf(format) < 0) {
      throw Error(
        `Invalid format value in params. Supported are: ${JSON.stringify(
          formatValues
        )} `
      );
    }

    console.log({ bg });

    if (!isHexColor.test(bg)) {
      throw Error(`Invalid hex color value in params`);
    }

    let externalImageRes = await fetch(src);
    let externalImage = await externalImageRes.arrayBuffer();

    let imgBuffer = await sharp(Buffer.from(externalImage), {
      animated: format === "gif",
    })
      .resize({
        width: w,
        height: h,
        fit: f as any,
        background: bg,
        position: p,
      })
      .toFormat(format as any, { quality: q })
      .toBuffer();

    res.setHeader("Content-Type", `image/${format}`);
    res.writeHead(200);
    res.end(imgBuffer);
  } catch (err: any) {
    let errMsg = err.message;
    res.writeHead(400);
    res.end(errMsg);
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
