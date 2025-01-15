const fs = require("fs");
const path = require("path");

function getTextbundlePlainText(textbundlePath, md) {
  const textPath = path.join(textbundlePath, "text.md");

  if (!fs.existsSync(textPath)) {
    throw new Error(`Missing text.md in ${textbundlePath}`);
  }

  const markdownContent = fs.readFileSync(textPath, "utf8");

  // Regex to match YAML frontmatter (starts and ends with ---)
  const frontmatterRegex = /^---\s*[\s\S]*?\s*---\s*/;

  // Remove frontmatter (if any) from the markdown string and rewrite links
  const contentWithoutFrontmatter = markdownContent
    .replace(frontmatterRegex, '')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1 ($2)');

  const plainTextContent = md.render(contentWithoutFrontmatter)
    .replace(/<\/p>/g, "\n") // Try to preserve paragraph spacing
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .trim();

  // console.log('--------');
  // console.log(markdownContent);
  // console.log('--------');
  // console.log(contentWithoutFrontmatter);
  // console.log('--------');
  // console.log(md.render(contentWithoutFrontmatter));
  // console.log('--------');
  // console.log(plainTextContent);
  // console.log('--------');

  return plainTextContent;
}

function truncateContent(content, limit, link) {
  if(link) {
    if (content.length + link.length + 4 > limit) {
      return content.slice(0, limit - (4 + link.length)) + "... " + link;
    } else {
      return `${content} ${link}`;
    }
  } else if (content.length > limit) {
    return content.slice(0, limit - 3) + "...";
  }

  return content;
}

module.exports = {
  getTextbundlePlainText,
  truncateContent
}
