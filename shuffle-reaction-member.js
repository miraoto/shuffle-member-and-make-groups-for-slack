const { WebClient } = require('@slack/client');
const request = require('sync-request');

const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const slackApiUrl = 'https://slack.com/api';
const muxNumPerGroup = 2;

function fetchLatestBotMesssageTimestamp() {
  const res = request('GET', `${slackApiUrl}/channels.history?token=${token}&channel=${channelId}&pretty=1`);
  const messages = JSON.parse(res.getBody('utf8')).messages;
  messages.some((message) => {
    if (message.subtype == 'bot_message') {
      botMessage = message
      return true;
    }
  });
  return botMessage.ts;
}

function fetchReactions(ts) {
  const res = request('GET', `${slackApiUrl}/reactions.get?token=${token}&channel=${channelId}&timestamp=${ts}&pretty=1`);
  return JSON.parse(res.getBody('utf8')).message.reactions;
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

function grouping(members) {
  const groupNum = Math.ceil(members.length / muxNumPerGroup);
  const groups = new Array(groupNum.length);

  for(let i = 0; i < groupNum; i++) {
    groups[i] = new Array(0);
  }
  let groupNo = 0;
  for (let i = 0; i < members.length; i++) {
    groups[groupNo].push(members[i]);
    groupNo = (groupNo < groupNum - 1) ? groupNo + 1 : 0;
  }
  return groups;
}

exports.handler = (event, context, callback) => {
  console.log('start [' + event.name + ']');

  const ts = fetchLatestBotMesssageTimestamp();

  let reactionMembers = [];
  const reactions = fetchReactions(ts);
  reactions.map((reaction) => {
    reactionMembers.push(reaction.users);
  })
  reactionMembers = Array.prototype.concat.apply([], reactionMembers);

  const members = shuffle(fetchMembers(reactionMembers));
  const groups = grouping(members);

  let msg = "I made a group. The one on the left is the leader.\n";
  groups.map((group, index) => {
    msg += "Group:" + (index + 1)  + ' @' + group.join(' @') + "\n";
  });

  const web = new WebClient(token);
  web.chat.postMessage({ channel: channelId, text: msg, link_names: 1 })
    .then((res) => {
      console.log('Message sent: ', res.ts);
    }).catch(console.error);
  callback(null);
  console.log('end [' + event.name + ']')
};
