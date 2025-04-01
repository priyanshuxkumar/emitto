import { kafka } from "./client";
import { TOPIC_EMAIL, TOPIC_SMS } from "./config";

(async function init() {
    const admin = kafka.admin();
    console.log("Admin connecting...");

    await admin.connect();
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
    console.log(`Topic Created Success [${TOPIC_EMAIL}, ${TOPIC_SMS}]`);
    console.log("Disconnecting Admin..");
    await admin.disconnect();
})();
