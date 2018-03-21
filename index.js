const { WebClient } = require('@slack/client');
const request = require('sync-request');

const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const slackApiUrl = 'https://slack.com/api';

function fetchChannel() {
  const res = request('GET', `${slackApiUrl}/channels.info?token=${token}&channel=${channelId}&pretty=1`);
  return JSON.parse(res.getBody('utf8')).channel;
}

function fetchMembers(ids) {
  let members = [];
  ids.map((id) => {
    const res = request('GET', `${slackApiUrl}/users.info?token=${token}&user=${id}&pretty=1`);
    members.push(JSON.parse(res.getBody('utf8')).user.name);
  });
  return members;
}

function shuffle(arr) {
  let array = arr
  for(var i = array.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

exports.handler = (event, context, callback) => {
  console.log('start [' + event.name + ']');

  const channel = fetchChannel();
  const members = shuffle(fetchMembers(channel.members));
  const lunch_group_num = Math.ceil(members.length / 4);
  const lunch_members = new Array(lunch_group_num.length);

  for(let i = 0; i < lunch_group_num; i++) {
    lunch_members[i] = new Array(0);
  }
  let lunch_group = 0;
  for (let i = 0; i < members.length; i++) {
    lunch_members[lunch_group].push(members[i]);
    lunch_group = (lunch_group < lunch_group_num - 1) ? lunch_group + 1 : 0;
  }
  console.log(lunch_members);

  const web = new WebClient(token);
  web.chat.postMessage({ channel: channelId, text: lunch_members })
    .then((res) => {
      console.log('Message sent: ', res.ts);
    }).catch(console.error);
  callback(null);
  console.log('end [' + event.name + ']')
};
