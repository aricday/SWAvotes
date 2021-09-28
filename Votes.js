// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var fs = require('fs');

client.messages
      .list({
         to: process.env.TWILIO_VOTER_NUMBER
       })
      .then(messages => messages.forEach(m => fs.writeFile('vote.txt',m.from+"|"+m.body+"\n",  {'flag':'a'},  function(err) {
        if (err) {
        return console.error(err);
    }
    })));
