import { writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(file) {
  if (!file || file.size === 0) {
    throw new Error("Image is required");
  }

  const filename = `${Date.now()}_${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadPath = path.join(
    process.cwd(),
    "public/uploads",
    filename
  );

  await writeFile(uploadPath, buffer);

  return `${filename}`; // image path return
}
