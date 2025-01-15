require("dotenv").config();

const yargs = require('yargs');

const mast = require('./mastodon');
const bsky = require('./bluesky');

function computeBackref(link) {
  if(link && !link.startsWith('http')) {
    return `${process.env.BACKREF_HOST}${link.startsWith('/') ? '' : '/'}${link}`;
  }

  return link;
}

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

const link = computeBackref(argv.link);

if(argv.mastodon) {
  mast(argv.file, link)
}

if(argv.bluesky) {
  bsky(argv.file, link)
}


