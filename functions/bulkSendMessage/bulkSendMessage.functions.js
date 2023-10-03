const admin = require('../firebase-admin');
const axios = require('axios');
const { SEND_MESSAGE_API, SUPPORT_ACCOUNT } = require("../constants")

const getRoomName = (user) => user + "-email|60c208341febfddccc8a197c";

const updateRoomDataForUser = (receiverId, roomName, messageData) => {
    return admin.firestore().collection(`users/${receiverId}/chat_rooms`)
        .doc(roomName)
        .set(messageData, { merge: true }).catch(console.warn)
}


const bulkSendMessage = (req, res) => {
    const receivers = req.body.receivers || [];
    const messageObj = req.body.message;

    const messagePreview = messageObj.image ? 'image' : messageObj.text;
    const messageTime = messageObj.createdAt ? Date.parse(messageObj.createdAt) : Date.now();


    receivers.forEach((receiver) => {

        updateRoomDataForUser(SUPPORT_ACCOUNT.userId,
            getRoomName(receiver),
            {
                receiver,
                lastMessage: messagePreview,
                lastMessageTime: messageTime,
                lastMessageSender: SUPPORT_ACCOUNT.userId,
                isWithSupport: true,
                roomName: getRoomName(receiver),
            });


        updateRoomDataForUser(receiver,
            getRoomName(receiver),
            {
                receiver,
                lastMessage: messagePreview,
                lastMessageTime: messageTime,
                lastMessageSender: SUPPORT_ACCOUNT.userId,
                isWithSupport: true,
                roomName: getRoomName(receiver),
            });


        admin.firestore().collection('chat_rooms')
            .doc(getRoomName(receiver))
            .collection('messages')
            .add({
                ...messageObj,
                sentBy: SUPPORT_ACCOUNT.userId,
                sentTo: receiver,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            })
            .then(_ => res.end('message sent'))
            .catch(console.warn);

    })

    // Send notification to otherUser
    const body = {
        user_ids: receivers,
        title: SUPPORT_ACCOUNT.name,
        message: messagePreview,
        metadata: {
            'type': "CHAT_ROOM",
            'with_user_id': SUPPORT_ACCOUNT.userId,
        },
        image: SUPPORT_ACCOUNT.avatar,
    };

    axios.post(SEND_MESSAGE_API, body)
        .then(response => console.log("=== success: " + response.data))
        .catch(e => console.log("Error: " + e));

}
module.exports = { bulkSendMessage };

