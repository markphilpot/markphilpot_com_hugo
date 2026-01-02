import fs from "fs";
import path from "path";

interface Frontmatter {
  [key: string]: any;
  title?: string;
  summary?: string;
  date?: string;
  slug?: string;
}

function extractFrontmatter(textbundlePath: string): Frontmatter {
  const textPath = path.join(textbundlePath, "text.md");

  if (!fs.existsSync(textPath)) {
    throw new Error(`Missing text.md in ${textbundlePath}`);
  }

  const markdown = fs.readFileSync(textPath, "utf8");

  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {};
  }

  const frontmatterContent = match[1];
  const lines = frontmatterContent.split('\n');
  const result: Frontmatter = {};

  lines.forEach(line => {
    const [key, ...rest] = line.split(':').map(str => str.trim());
    const value = rest.join(':');

    if (key && value !== undefined) {
      if (value === 'true') {
        result[key] = true;
      } else if (value === 'false') {
        result[key] = false;
      } else {
        result[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  });

  return result;
}

function getTextbundlePlainText(textbundlePath: string, md: any): string {
  const textPath = path.join(textbundlePath, "text.md");

  if (!fs.existsSync(textPath)) {
    throw new Error(`Missing text.md in ${textbundlePath}`);
  }

  const markdownContent = fs.readFileSync(textPath, "utf8");

  const frontmatterRegex = /^---\s*[\s\S]*?\s*---\s*/;

  const contentWithoutFrontmatter = markdownContent
    .replace(frontmatterRegex, '');

  const plainTextContent = md.render(contentWithoutFrontmatter)
    .replace(/<\/p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();

  return plainTextContent;
}

function truncateContent(content: string, limit: number, link?: string): string {
  if (link) {
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

function computeBackref(textbundlePath: string): string {
  const { date, slug } = extractFrontmatter(textbundlePath);

  const d = new Date(date!);

  if (textbundlePath.includes("micro")) {
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

function findFirstImage(textbundlePath: string): string | null {
  const assetsPath = path.join(textbundlePath, "assets");

  if (!fs.existsSync(assetsPath) || !fs.statSync(assetsPath).isDirectory()) {
    return null;
  }

  const files = fs.readdirSync(assetsPath);
  const firstImage = files.find((file) => isImage(file));

  return firstImage ? path.join(assetsPath, firstImage) : null;
}

function isImage(filename: string): boolean {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

function preparePostContent(textbundlePath: string, md: any): string {
  const plainTextContent = getTextbundlePlainText(textbundlePath, md);
  const { title, summary } = extractFrontmatter(textbundlePath);

  return title ? `${title}\n\n${summary}` : plainTextContent;
}

export {
  getTextbundlePlainText,
  truncateContent,
  computeBackref,
  extractFrontmatter,
  findFirstImage,
  isImage,
  preparePostContent,
};
