import { kafka } from "./client";
import { TOPIC_EMAIL, TOPIC_SMS } from "./config";
import { processEmail, processSMS } from "./helper";

const group = process.argv[2]!;

const consumer = kafka.consumer({ groupId : group });

(async function main() {
    await consumer.connect();
    console.log("Consumer Connected Successfully");

    await consumer.subscribe({
        topic : TOPIC_EMAIL,
    }); 
    
    await consumer.subscribe({
        topic : TOPIC_SMS
    });

    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            if(message?.value){
                console.log({
                    topic ,
                    partition,
                    offset: message.offset,
                    value: JSON.parse(message?.value.toString()),
                });
            };
            if(!message || !message.value) {
                throw new Error('Field are undefined');
            };

            const data = JSON.parse(message?.value.toString());
            
            switch (topic) {
                case "email-events": 
                    processEmail(data); // Process emails
                    break;
                case "sms-events":
                    processSMS(data); // Process SMS
                    break;
                default:
                    break;
            };
        }
    })
})();


