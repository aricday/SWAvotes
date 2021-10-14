 // swavotes
 // Simple tabulator for twilio text message voting app.
 // Designed to be deployed to AWS lambda.

const yaml = require('js-yaml');
const fs = require('fs');

// Twilio Setup
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twilio = require('twilio')(apiKey, apiSecret, { accountSid: accountSid });

// Load the team names from an ordered list in a yaml file
const teamNameMap = yaml.load(fs.readFileSync("teams.yml", { encoding: "utf-8" }));

module.exports.to_html = async function () {
  const messages = await getTwilioMessages();
  console.log("messages:", messages)
  let votes = tallyVotes(messages);
  console.log("votes:", votes);

  let css = fs.readFileSync('table.min.css', { encoding: "utf-8" });
  let html = [String.raw`<!DOCTYPE html><html><head><style type=text/css>${css}</style><title>SWAvotes</title></head><body>`];
  html.push('<table><thead><tr><th>Number</th><th>Team</th><th>Votes</th></tr></thead>');
  
  for (let i = 1; i <= 11; i++) {
    html.push(`<tr><td>${i}</td><td>${teamNameMap[i]}</td><td>${votes[i]}</td></tr>`);
  }
  
  html.push('</ul></body></html>');
  const out_html = html.join('');
  return (out_html);
};

function tallyVotes(msgs) {
  let teamVotes = [...new Array(12)].map(() => 0); // 12 elements because teams are numbered 1..11, team 0 is unused
  let sources = {};
  msgs.reverse().forEach(m => sources[m.from] = m.body); // keep the last vote from each "msgs.from"
  // msgs.forEach(m => sources[m.from] = m.body); // keep the last vote from each "msgs.from"
  Object.keys(sources).forEach(s => teamVotes[sources[s]] += 1); // Iterate through each source to tally team votes
  return (teamVotes);
}

async function getTwilioMessages() {
  let msgList = [];
  await twilio.messages
  .list({
    to: process.env.TWILIO_VOTER_NUMBER
  })
  .then(messages => messages.forEach(m =>
    msgList.push(m)
    ));
  return(msgList)
};
