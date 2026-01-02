require("dotenv").config();

const yargs = require('yargs');
const React = require('react');
const { render } = require('ink');
const MarkdownIt = require('markdown-it');

const mastodon = require('./mastodon');
const bluesky = require('./bluesky');
const { computeBackref, preparePostContent, truncateContent } = require('./common');
const CrossPostUI = require('./ui/CrossPostUI');

const md = new MarkdownIt();

const argv = yargs
  .scriptName("xpost")
  .option("f", {
    alias: 'file',
    demandOption: true,
    describe: "The .textbundle file to post",
    type: 'string'
  })
  .option('mastodon', {
    alias: 'm',
    describe: 'Send post to Mastodon (deprecated: use TUI)',
    type: 'boolean',
  })
  .option('bluesky', {
    alias: 'b',
    describe: 'Send post to Bluesky (deprecated: use TUI)',
    type: 'boolean',
  })
  .option('link', {
    alias: 'l',
    describe: 'Link back to post (deprecated: use TUI)',
    type: 'boolean',
  })
  .option('preview', {
    alias: 'p',
    describe: 'Preview output (deprecated: use TUI)',
    type: 'boolean',
  })
  .option('no-tui', {
    describe: 'Disable TUI and use legacy CLI mode',
    type: 'boolean',
    default: false,
  })
  .help('h')
  .alias('h', 'help')
  .version(false)
  .argv;

async function main() {
  const textbundlePath = argv.file;

  // Legacy CLI mode (backward compatibility)
  if (argv['no-tui'] || argv.preview) {
    const link = argv.link ? computeBackref(textbundlePath) : undefined;
    const content = preparePostContent(textbundlePath, md);

    if (argv.mastodon) {
      const mastodonLimit = await mastodon.getCharLimit();
      const truncated = truncateContent(content, mastodonLimit, link);
      await mastodon.post(textbundlePath, truncated, argv.preview);
    }

    if (argv.bluesky) {
      const blueskyLimit = bluesky.getCharLimit();
      const truncated = truncateContent(content, blueskyLimit, link);
      await bluesky.post(textbundlePath, truncated, argv.preview);
    }

    return;
  }

  // TUI mode (default)
  const initialContent = preparePostContent(textbundlePath, md);
  const backlink = computeBackref(textbundlePath);

  const { waitUntilExit } = render(
    React.createElement(CrossPostUI, {
      textbundlePath,
      initialContent,
      backlink,
      onSubmit: async (postData) => {
        const { content, platforms, includeBacklink } = postData;
        const link = includeBacklink ? backlink : undefined;

        try {
          if (platforms.mastodon) {
            const mastodonLimit = await mastodon.getCharLimit();
            const truncated = truncateContent(content, mastodonLimit, link);
            await mastodon.post(textbundlePath, truncated, false);
          }

          if (platforms.bluesky) {
            const blueskyLimit = bluesky.getCharLimit();
            const truncated = truncateContent(content, blueskyLimit, link);
            await bluesky.post(textbundlePath, truncated, false);
          }
        } catch (error) {
          console.error("Error posting:", error.message);
          process.exit(1);
        }
      },
      onCancel: () => {
        console.log("Cancelled.");
        process.exit(0);
      }
    })
  );

  await waitUntilExit();
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});


