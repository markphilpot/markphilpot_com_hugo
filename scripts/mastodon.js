require("dotenv").config();

const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const Mastodon = require("mastodon-api");

const { getTextbundlePlainText, truncateContent, extractFrontmatter } = require("./common");

const MASTODON_ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;
const MASTODON_API_URL = process.env.MASTODON_API_URL;

const md = MarkdownIt();

const mastodonClient = new Mastodon({
  access_token: MASTODON_ACCESS_TOKEN,
  api_url: `${MASTODON_API_URL}`,
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
    const params = mediaId ? { status, media_ids: [mediaId] } : { status };
    await postStatus(params);

    console.log("Mastodon post created successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function getCharLimit() {
  const response = await mastodonClient.get("/instance");
  return response.data.configuration.statuses.max_characters;
}

function isImage(filename) {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

async function uploadMedia(imagePath) {
  const mediaResponse = await mastodonClient.post("/media", {
    file: fs.createReadStream(imagePath),
  });
  return mediaResponse.data.id;
}

async function postStatus(params) {
  await mastodonClient.post("/statuses", params);
}

module.exports = main
