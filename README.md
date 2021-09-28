# SWAvotes
Voter repo for sms survey

$ ./voteResults.sh

### Pull Results into "vote.txt"
``` client.messages
      .list({
         to: process.env.TWILIO_VOTER_NUMBER
       })
      .then(messages => messages.forEach(m => fs.writeFile('vote.txt',m.from+"|"+m.body+"\n",  {'flag':'a'},  function(err) {
        if (err) {
        return console.error(err);
    }
    }))); ```
    
### Votes for 
$ sort -u -t"|" -k 1,1  vote.txt | awk -F"|" '$2==1' | wc -l

