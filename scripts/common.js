const fs = require("fs");
const path = require("path");

function extractFrontmatter(textbundlePath, md) {
  const textPath = path.join(textbundlePath, "text.md");

  if (!fs.existsSync(textPath)) {
    throw new Error(`Missing text.md in ${textbundlePath}`);
  }

  const markdown = fs.readFileSync(textPath, "utf8");

  const frontmatterRegex = /^---\n([\s\S]*?)\n---/; // Regex to match the frontmatter block
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {}; // Return an empty object if no frontmatter is found
  }

  const frontmatterContent = match[1];
  const lines = frontmatterContent.split('\n');
  const result = {};

  lines.forEach(line => {
    const [key, ...rest] = line.split(':').map(str => str.trim());
    const value = rest.join(':');

    if (key && value !== undefined) {
      if (value === 'true') {
        result[key] = true;
      } else if (value === 'false') {
        result[key] = false;
      } else {
        result[key] = value.replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes if present
      }
    }
  });

  return result;
}

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
    .replace(frontmatterRegex, '');
    // .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1 ($2)');

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
    if (content.length + link.length + 7 > limit) {
      return content.slice(0, limit - (7 + link.length)) + "...\n\n➡️ " + link;
    } else {
      return `${content}\n\n➡️ ${link}`;
    }
  } else if (content.length > limit) {
    return content.slice(0, limit - 3) + "...";
  }

  return content;
}

function computeBackref(textbundlePath) {
  const { date, slug } = extractFrontmatter(textbundlePath);

  const d = new Date(date);

  if(textbundlePath.includes("micro")) {
    const category = "micro"

    const year = `${d.getFullYear()}`
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const hour = `${d.getHours()}`.padStart(2, "0");
    const minute = `${d.getMinutes()}`.padStart(2, "0");

    return `${process.env.BACKREF_HOST}/${category}/${year}${month}${day}${hour}${minute}/`;
  } else {
    const category = "posts"

    const year = `${d.getFullYear()}`
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");

    return `${process.env.BACKREF_HOST}/${category}/${year}/${month}/${day}/${slug}/`;
  }
}

module.exports = {
  getTextbundlePlainText,
  truncateContent,
  computeBackref,
  extractFrontmatter,
}
