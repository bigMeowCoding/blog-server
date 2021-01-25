import * as path from "path";
import * as fs from "fs";
import { ReadStream } from "fs";

export function createPlaceHolderImage(): {
  type: string;
  stream: ReadStream;
} {
  const filePath = path.resolve(__dirname, "../../public/assets/images");
  return {
    type: "image/jpg",
    stream: fs.createReadStream(path.resolve(filePath, "placeholder.jpeg")),
  };
}
