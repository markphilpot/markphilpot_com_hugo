require("dotenv").config();

const yargs = require('yargs');

const mast = require('./mastodon');
const bsky = require('./bluesky');
const { computeBackref } = require('./common');

var argv = yargs
  .scriptName("xpost")
  .option("f", {
    alias: 'file',
    demandOption: true,
    describe: "The .textbundle file to post",
    type: 'string'
  })
  .option('mastodon', {
    alias: 'm',
    describe: 'Send post to Mastodon',
    type: 'boolean',
  })
  .option('bluesky', {
    alias: 'b',
    describe: 'Send post to Mastodon',
    type: 'boolean',
  })
  .option('link', {
    alias: 'l',
    describe: 'Link back to post',
    type: 'boolean',
  })
  .option('preview', {
    alias: 'p',
    describe: 'Preview output (skip posting)',
    type: 'boolean',
  })
  .help('h')
  .alias('h', 'help')
  .version(false)
  .argv;

const link = argv.link ? computeBackref(argv.file) : undefined;

if(argv.mastodon) {
  mast(argv.file, link, argv.preview)
}

if(argv.bluesky) {
  bsky(argv.file, link, argv.preview)
}


