import { PublishCommand } from "@aws-sdk/client-sns";
import { SendSMS } from "./types";
import { snsClient } from "./config";


function smsParams (payload : SendSMS) {
  if(!payload) throw new Error("Fields values can't be empty");
  const params = {
    Message: "Hey test sms ezysend!",
    PhoneNumber: "+91111100000",
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };
  return params;
}


async function sendSMS(payload : SendSMS) {
  let params = smsParams(payload);
  try {
    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    return response;
  } catch (err) {
    throw err;
  }
}

export { sendSMS }
