const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));


const { excuteQuery } = require("./bigquery/bigquery.functions");
const { messageSenderFunc } = require("./chat/chat.functions");
const { routePasswordlessToSMS } = require("./sms/sms.functions");
const { bulkSendMessage } = require("./bulkSendMessage/bulkSendMessage.functions");

exports.bulkSendMessage = functions.https.onRequest(bulkSendMessage);

app.post('/', (req, res) => {
    messageSenderFunc(req, res);
});
exports.messageSender = functions.https.onRequest(app);



const app2 = express();
app2.use(cors({ origin: true }));
app2.post('/excuteQuery', (req, res) => {
    excuteQuery(req, res);
});
exports.bigquery = functions.runWith({
    timeoutSeconds: 300,
}).https.onRequest(app2);



const app3 = express();
app3.use(cors({ origin: true }));
app3.post('/sms', (req, res) => {
    routePasswordlessToSMS(req, res);
});
exports.gatewaySMSRouting = functions.https.onRequest(app3);


//
// exports.sendNotificationDependsOnEvent = functions
//     .runWith({ failurePolicy: true })
//     .firestore
//     .document('chat_rooms/{room}/messages/{message}')
//     .onCreate((snap, context) => {
//      //   console.log('Document data:', snap.data());
//      //  if (!snap.exists) {
//      //    console.log('No such document!');
//      //  } else {
//      //      const data = snap.data();
//      //      if (data.handleInCloud) {
//      //
//      //          const body = {
//      //              to_user_id: data.sentTo,
//      //              from_user_id: data.sentBy,
//      //              message: data.text,
//      //              avatar: data.user.avatar,
//      //          };
//      //
//      //          console.log("====== BODY: ", JSON.stringify(body))
//      //
//      //          axios.post('https://q9enjzovpl.execute-api.eu-west-1.amazonaws.com/prod/api/app/messaging/web/notify?api_key=yCD6MZYvsI0rIwSGdZ3tnuTv9kZqYVi', body)
//      //              .then(response => console.log("=== success: " + response.data))
//      //              .catch(e => console.log("Error: " + e));
//      //      }
//      //  }
//     });


