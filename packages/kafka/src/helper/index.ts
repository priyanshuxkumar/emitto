import { sendEmail, sendSMS } from "@repo/notifications";
import { EmailPayload, SMSPayload } from "../types";
import { Prisma, prisma } from "@repo/db";

async function processEmail(data: EmailPayload) {
  const payload = {
    from: data.from,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };
  try {
    const response = await sendEmail(payload);

    if (response.$metadata.httpStatusCode === 200) {
      await prisma.$transaction(async (tx) => {
        //Make the entry  of email on db
        const email = await tx.email.create({
          data: {
            from: String(data.from),
            to: data.to,
            subject: String(data.subject),
            html: String(data.html),
            metadata: JSON.stringify(response),
            userId: data.userId,
          },
        });
        //Update the response status in apikey logs
        await tx.apiKeyLogs.update({
          where: {
            id: data.apikeylogId,
          },
          data: {
            responseBody: { id: email.id } as Prisma.JsonObject,
            responseStatus: response.$metadata.httpStatusCode,
          },
        });
      });
      console.log("Response MessageId EMAIL", response.MessageId);
    }
  } catch (error) {
    console.log("Error in sending email consumer");
  }
}

async function processSMS(data: SMSPayload) {
  const payload = {
    message: data.message,
    phoneNumber: data.phoneNumber,
  };

  try {
    const response = await sendSMS(payload);
    
    if (response.$metadata.httpStatusCode === 200) {
        await prisma.$transaction(async (tx) => {
          //Make the entry  of sms on db
          const sms = await tx.sms.create({
            data: {
              message : data.message,
              phoneNumber : data.phoneNumber,
              metadata: JSON.stringify(response),
              userId: data.userId,
            },
          });
          //Update the response status in apikey logs
          await tx.apiKeyLogs.update({
            where: {
              id: data.apikeylogId,
            },
            data: {
              responseBody: { id: sms.id } as Prisma.JsonObject,
              responseStatus: response.$metadata.httpStatusCode,
            },
          });
        });
        console.log("Response MessageId SMS", response.MessageId);
      }
  } catch (error) {
    console.log("Error in sending SMS consumer");
  }
}

export { processEmail, processSMS };
