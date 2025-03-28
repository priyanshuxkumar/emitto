import { SendEmail } from "./types";
import { sesClient } from "./config";
import { SendEmailCommand } from "@aws-sdk/client-ses";


function emailParams (payload : SendEmail) {
  if(!payload) throw new Error("Fields values can't be empty");

  const textVersion = payload?.html?.replace(/<\/?[^>]+(>|$)/g, ""); 

  const params = {
    Source: payload.from,
    Destination: {
      ToAddresses: [...payload.to],
    },
    Message: {
      Subject: { Data: payload.subject, Charset: "UTF-8" },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: payload.html,
        },
        Text : {
          Charset: "UTF-8",
          Data : textVersion
        }
      },
    },
  };
  return params;
}

async function sendEmail(payload: SendEmail) {
  let params = emailParams(payload);
  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    return response;
  } catch (error : unknown) {
    throw error;
  }
}

export { sendEmail };