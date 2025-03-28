require("dotenv").config();

const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const { createRestAPIClient } = require("masto");

const { getTextbundlePlainText, truncateContent, extractFrontmatter } = require("./common");

const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;
const MASTODON_API_URL = process.env.MASTODON_API_URL;

const md = MarkdownIt();

const masto = createRestAPIClient({
  url: MASTODON_API_URL,
  accessToken: MASTODON_ACCESS_TOKEN,
  // log: 'debug'
});

async function main(textbundle, link, preview) {
  try {
    const assetsPath = path.join(textbundle, "assets");

    const plainTextContent = getTextbundlePlainText(textbundle, md);
    const { title, summary } = extractFrontmatter(textbundle);

    const content = title ? `${title}\n\n${summary}` : plainTextContent;

    // Get character limit from Mastodon
    const charLimit = await getCharLimit();
    const truncatedContent = truncateContent(content, charLimit, link);

    if(preview) {
      console.log('\n\n--- Mastodon Post ---');
      console.log(truncatedContent);
      return;
    }

    // Find the first image in the assets folder
    let mediaId = null;
    if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
      const files = fs.readdirSync(assetsPath);
      const firstImage = files.find((file) => isImage(file));

      if (firstImage) {
        const imagePath = path.join(assetsPath, firstImage);
        mediaId = await uploadMedia(imagePath);
      }
    }

    // Create the Mastodon post
    const status = truncatedContent;
    const params = mediaId ? { status, mediaIds: [mediaId] } : { status };
    await postStatus(params);

    console.log("Mastodon post created successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function getCharLimit() {
  const instance = await masto.v1.instance.fetch();
  return instance.configuration.statuses.maxCharacters;
}

function isImage(filename) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

async function uploadMedia(imagePath) {
  const mediaResponse = await masto.v2.media.create({
    file: new Blob([fs.readFileSync(imagePath)]),
  });
  return mediaResponse.id;
}

async function postStatus(params) {
  await masto.v1.statuses.create(params);
}

module.exports = main
