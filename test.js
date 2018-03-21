require('dotenv').config();

var event = {
  "value1": "value1"
};

var context = {
    succeed: function(data){console.log(JSON.stringify(data,' ',4));},
    fail: function(data){console.log("fail!!\n" + JSON.stringify(data,' ',4));},
    invokedFunctionArn: 'test:development',
    functionName: 'test',
    functionVersion: '$LATEST'
};
var callback = function(){};

var myLambda = require('./index');
myLambda.handler(event, context, callback);
