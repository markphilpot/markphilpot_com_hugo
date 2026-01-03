import "dotenv/config";
import fs from "fs";
import { AtpAgent, RichText } from "@atproto/api";
import { findFirstImage } from "./common.js";

const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME!;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD!;
const BLUESKY_CHAR_LIMIT = 300;

const agent = new AtpAgent({ service: "https://bsky.social" });

function getCharLimit(): number {
  return BLUESKY_CHAR_LIMIT;
}

async function post(textbundlePath: string, content: string, preview: boolean = false): Promise<void> {
  try {
    if (preview) {
      console.log('\n--- Bluesky Post ---');
      console.log(content);
      console.log(`\nCharacter count: ${content.length}/${BLUESKY_CHAR_LIMIT}`);
      return;
    }

    // Login
    await agent.login({
      identifier: BLUESKY_USERNAME,
      password: BLUESKY_PASSWORD
    });

    // Find and upload image if it exists
    const imagePath = findFirstImage(textbundlePath);
    let imageBlob: any = null;

    if (imagePath) {
      imageBlob = await uploadImage(imagePath);
    }

    // Create RichText instance and detect facets (for clickable links)
    const rt = new RichText({ text: content });
    await rt.detectFacets(agent);

    // Create post
    const postRecord = {
      text: rt.text,
      facets: rt.facets,
      embed: imageBlob ? {
        $type: "app.bsky.embed.images",
        images: [{
          alt: 'blog post image',
          image: imageBlob
        }]
      } : undefined,
    };

    await agent.post(postRecord);

    console.log("Bluesky post created successfully.");
  } catch (error: any) {
    console.error("Bluesky error:", error.message);
    throw error;
  }
}

async function uploadImage(imagePath: string): Promise<any> {
  const imageBuffer = fs.readFileSync(imagePath);

  const uploadResponse = await agent.uploadBlob(imageBuffer, {
    encoding: "image/*",
  });

  return uploadResponse.data.blob;
}

export { post, getCharLimit };
