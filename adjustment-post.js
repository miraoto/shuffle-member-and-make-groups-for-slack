const { WebClient } = require('@slack/client');
const request = require('sync-request');

const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const slackApiUrl = 'https://slack.com/api';

exports.handler = (event, context, callback) => {
  console.log('start [' + event.name + ']');

  msg = "@here We are looking for participants of shuffle lunch! If you want to go for lunch, please react here."

  const web = new WebClient(token);
  web.chat.postMessage({ channel: channelId, text: msg, link_names: 1 })
    .then((res) => {
      console.log('Message sent: ', res.ts);
    }).catch(console.error);
  callback(null);
  console.log('end [' + event.name + ']')
};
