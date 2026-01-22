import "dotenv/config";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import React from 'react';
import { render } from 'ink';
import MarkdownIt from 'markdown-it';
import * as mastodon from './mastodon.js';
import * as bluesky from './bluesky.js';
import { computeBackref, preparePostContent, truncateContent } from './common.js';
import CrossPostUI from './ui/CrossPostUI.js';

interface Arguments {
  file: string;
  mastodon?: boolean;
  bluesky?: boolean;
  link?: boolean;
  preview?: boolean;
  'no-tui'?: boolean;
}

const md = new MarkdownIt();

const argv = await yargs(hideBin(process.argv))
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
  .parseAsync() as unknown as Arguments;

async function main(): Promise<void> {
  const textbundlePath = argv.file;

  // Legacy CLI mode (backward compatibility)
  if (argv['no-tui'] || argv.preview) {
    const link = argv.link ? computeBackref(textbundlePath) : undefined;
    const linkDisplayText = link ? new URL(link).hostname : undefined;
    const content = preparePostContent(textbundlePath, md);

    if (argv.mastodon) {
      const mastodonLimit = await mastodon.getCharLimit();
      const truncated = truncateContent(content, mastodonLimit, link);
      await mastodon.post(textbundlePath, truncated, argv.preview ?? false);
    }

    if (argv.bluesky) {
      const blueskyLimit = bluesky.getCharLimit();
      const truncated = truncateContent(content, blueskyLimit, link, linkDisplayText);
      await bluesky.post(textbundlePath, truncated, argv.preview ?? false, link);
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
        const linkDisplayText = link ? new URL(link).hostname : undefined;

        try {
          if (platforms.mastodon) {
            const mastodonLimit = await mastodon.getCharLimit();
            const truncated = truncateContent(content, mastodonLimit, link);
            await mastodon.post(textbundlePath, truncated, false);
          }

          if (platforms.bluesky) {
            const blueskyLimit = bluesky.getCharLimit();
            const truncated = truncateContent(content, blueskyLimit, link, linkDisplayText);
            await bluesky.post(textbundlePath, truncated, false, link);
          }
        } catch (error: any) {
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

main().catch((error: any) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
