require('dotenv').config();

const event = {
  "value1": "value1"
};

const context = {
  succeed: function(data){console.log(JSON.stringify(data,' ',4));},
  fail: function(data){console.log("fail!!\n" + JSON.stringify(data,' ',4));},
  invokedFunctionArn: 'test:development',
  functionName: 'test',
  functionVersion: '$LATEST'
};
const callback = function(){};

//const myLambda = require('./adjustment-post');
//const myLambda = require('./shuffle-reaction-member');
const myLambda = require('./shuffle-channel-member');
myLambda.handler(event, context, callback);
