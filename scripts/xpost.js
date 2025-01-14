require("dotenv").config();

const yargs = require('yargs');

const mast = require('./mastodon');
const bsky = require('./bluesky');

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
    type: 'string',
  })
  .help('h')
  .alias('h', 'help')
  .version(false)
  .argv;

if(argv.mastodon) {
  mast(argv.file)
}

if(argv.bluesky) {
  bsky(argv.file)
}


