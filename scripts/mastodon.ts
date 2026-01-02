import "dotenv/config";
import fs from "fs";
import { createRestAPIClient } from "masto";
import { findFirstImage } from "./common.js";

const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN!;
const MASTODON_API_URL = process.env.MASTODON_API_URL!;

const masto = createRestAPIClient({
  url: MASTODON_API_URL,
  accessToken: MASTODON_ACCESS_TOKEN,
});

async function post(textbundlePath: string, content: string, preview: boolean = false): Promise<void> {
  try {
    if (preview) {
      console.log('\n--- Mastodon Post ---');
      console.log(content);
      console.log(`\nCharacter count: ${content.length}/${await getCharLimit()}`);
      return;
    }

    // Find and upload image if it exists
    const imagePath = findFirstImage(textbundlePath);
    let mediaId: string | null = null;

    if (imagePath) {
      mediaId = await uploadMedia(imagePath);
    }

    // Create the post
    const params = mediaId ? { status: content, mediaIds: [mediaId] } : { status: content };
    await masto.v1.statuses.create(params);

    console.log("Mastodon post created successfully.");
  } catch (error: any) {
    console.error("Mastodon error:", error.message);
    throw error;
  }
}

async function getCharLimit(): Promise<number> {
  const instance = await masto.v1.instance.fetch();
  return instance.configuration.statuses.maxCharacters;
}

async function uploadMedia(imagePath: string): Promise<string> {
  const mediaResponse = await masto.v2.media.create({
    file: new Blob([fs.readFileSync(imagePath)]),
  });
  return mediaResponse.id;
}

export { post, getCharLimit };
