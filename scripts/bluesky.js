require("dotenv").config();

const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const { AtpAgent } = require("@atproto/api");

const {getTextbundlePlainText, truncateContent} = require("./common");

const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

const md = MarkdownIt();

const agent = new AtpAgent({ service: "https://bsky.social" });

async function main(textbundle, link, preview) {
  try {
    await agent.login({ identifier: BLUESKY_USERNAME, password: BLUESKY_PASSWORD });

    const assetsPath = path.join(textbundle, "assets");

    const plainTextContent = getTextbundlePlainText(textbundle, md);

    const charLimit = 300;
    const truncatedContent = truncateContent(plainTextContent, charLimit, link);

    if(preview) {
      console.log('\n\n--- Bluesky Post ---');
      console.log(truncatedContent);
      return;
    }

    // Find the first image in the assets folder
    let imageBlob = null;
    if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
      const files = fs.readdirSync(assetsPath);
      const firstImage = files.find((file) => isImage(file));

      if (firstImage) {
        const imagePath = path.join(assetsPath, firstImage);
        imageBlob = await uploadImage(imagePath);
      }
    }

    // Create post
    const postRecord = {
      text: truncatedContent,
      embed: imageBlob ? { $type: "app.bsky.embed.images", images: [{
        alt: 'blog post image',
        image: imageBlob
      }] } : undefined,
    };

    await agent.post(postRecord);

    console.log("Bluesky post created successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function isImage(filename) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

async function uploadImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const uploadResponse = await agent.uploadBlob(imageBuffer, {
    encoding: "image/*", // Automatically infer the type
  });

  return uploadResponse.data.blob;
}

module.exports = main
