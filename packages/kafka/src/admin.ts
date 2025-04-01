import { kafka } from "./client";
import { TOPIC_SMS } from "./config";

const TOPIC_EMAIL = "email-notification-events";

(async function init() {
    const admin = kafka.admin();
    console.log("Admin connecting...");

    admin.connect();
    console.log("Admin Connection Success...");

    await admin.createTopics({
        topics: [
            {
                topic: TOPIC_EMAIL,
                numPartitions: 2
            },
            {
                topic : TOPIC_SMS,
                numPartitions : 2
            }
        ]
    });
    console.log(`Topic Created Success [${TOPIC_EMAIL}]`);
    console.log("Disconnecting Admin..");
    await admin.disconnect();
})();
