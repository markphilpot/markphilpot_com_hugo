require("dotenv").config();

const yargs = require('yargs');

var argv = yargs
  .scriptName("xpost")
  .option("f", {
    alias: 'file',
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
  .help('h')
  .alias('h', 'help')
  .argv;

console.log(argv);




