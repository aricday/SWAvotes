 // swavotes
 // Simple tabulator for twilio text message voting app.
 // Designed to be deployed to AWS lambda.

const yaml = require('js-yaml');
const fs = require('fs');
const ejs = require('ejs');

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

module.exports.to_html_ejs = async function () {
  const messages = await getTwilioMessages();
  let votes = tallyVotes(messages);
  console.log("votes:", votes);

  let template = fs.readFileSync('votes.ejs', { encoding: "utf-8" });
  console.log(template);
  let html = ejs.render(template, { votes: votes, teamNameMap: teamNameMap }, {});
  return (html);
};
module.exports.to_html = async function () {
  const messages = await getTwilioMessages();
  let votes = tallyVotes(messages);
  console.log("votes:", votes);
  let html = ['<!DOCTYPE html><html><head><link rel="stylesheet" href="table.css"><title>SWAvotes</title></head><body>'];
  html.push('<table><thead><tr><th>Number</th><th>Team</th><th>Votes</th></tr></thead>');
  
  for (let i = 1; i <= 11; i++) {
    html.push(`<tr><td>${i}</td><td>${teamNameMap[i]}</td><td>${votes[i]}</td></tr>`);
  }
  
  html.push('</ul></body></html>');
  const out_html = html.join('');
  return (out_html);
};

function tallyVotes(msgs) {
  let teamVotes = [...new Array(17)].map(() => 0); // 17 elements because teams are numbered 1..16, team 0 is unused
  let sources = {};
  msgs.reverse().forEach(m => sources[m.from] = m.body); // keep the last vote from each "msgs.from"
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
