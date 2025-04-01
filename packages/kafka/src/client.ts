import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ezysend-service",
  brokers: ["localhost:9092"],
});

export { kafka };