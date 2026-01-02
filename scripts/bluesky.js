require("dotenv").config();

const fs = require("fs");
const { AtpAgent } = require("@atproto/api");

const { findFirstImage } = require("./common");

const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;
const BLUESKY_CHAR_LIMIT = 300;

const agent = new AtpAgent({ service: "https://bsky.social" });

function getCharLimit() {
  return BLUESKY_CHAR_LIMIT;
}

async function post(textbundlePath, content, preview) {
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
    let imageBlob = null;

    if (imagePath) {
      imageBlob = await uploadImage(imagePath);
    }

    // Create post
    const postRecord = {
      text: content,
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
  } catch (error) {
    console.error("Bluesky error:", error.message);
    throw error;
  }
}

async function uploadImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const uploadResponse = await agent.uploadBlob(imageBuffer, {
    encoding: "image/*",
  });

  return uploadResponse.data.blob;
}

module.exports = {
  post,
  getCharLimit,
}
