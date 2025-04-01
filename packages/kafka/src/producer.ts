import { kafka } from "./client";


const producer = kafka.producer();

(async function main() {
    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");
})();


export { producer };

