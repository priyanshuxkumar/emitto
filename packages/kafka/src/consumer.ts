import { kafka } from "./client";
import { TooManyRequestsError } from "./error/Error";
import { processEmail, processSMS } from "./helper";

const group = process.argv[2]!;
const topic = process.argv[3]!;

const consumer = kafka.consumer({ groupId : group });

(async function main() {
    await consumer.connect();
    console.log(`Consumer Connected Successfully, GROUP: ${group} TOPIC: ${topic}`);

    await consumer.subscribe({ topic });

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
            
            try {
                switch (topic) {
                    case "email-events": 
                        await processEmail(data); // Process emails
                        break;
                    case "sms-events":
                        await processSMS(data); // Process SMS
                        break;
                    default:
                        break;
                };
            } catch (e : any) {
                if(e instanceof TooManyRequestsError) {
                    console.warn(`Pausing topic ${topic} due to rate limit...`);
                    consumer.pause([{ topic }]);
                    
                    setTimeout(() => {
                        console.log(`Resuming topic ${topic}...`);
                        consumer.resume([{ topic }]);
                    }, e.retryAfter * 1000);
                } else if (e instanceof Error) {
                    console.error(e.message);
                }
                console.error("Error in consumer", e);
            }
        }
    })
})();


