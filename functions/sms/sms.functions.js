const axios = require('axios');

const BLOCKED_IPS = ['45.130.99.29'];
const MY_NUMBER = '+15802182944';
const SMS_GATEWAY = 'https://api.telnyx.com/v2/messages';

const routePasswordlessToSMS = (req, res) => {

    // Auth0 body content
    const recipient = req.body.recipient;
    const msg = req.body.body;
    const sender = req.body.sender;
    const extra = req.body.req;
    const ipAddress = !extra? undefined: extra.ip;

    if (BLOCKED_IPS.includes(ipAddress)) {
        return;
    }

    const body = {
        "from": MY_NUMBER,
        "alpha_sender": "Deelzat",
        "to": recipient,
        "text": msg,
        "messaging_profile_id": "4900017e-e950-75f8-fd21-5b7d5303d75c"
    };

    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer KEY017EE9B45FB9926B599E80C67F609056_8lQQSeeLG3rl1Hg6B0bPsy`,
        },
    }


    axios.post(SMS_GATEWAY, body, config)
        .then(() =>  {
            res.send('sent');
            console.log("success on sending: " + recipient)
        })
        .catch((e) => {
            res.status(500).send(JSON.stringify(e));
            console.error("error on sending: " + recipient)
        });
}
module.exports = {routePasswordlessToSMS};
