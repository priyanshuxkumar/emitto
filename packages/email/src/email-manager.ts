import { resend } from "./config";
import { EmailTemplate } from "./templates/sendEmailTemplate";
import { SendEmail } from "./types";


async function sendEmail({from_email , to_email , subject , body} : SendEmail) {
    try {
        const { data, error } = await resend.emails.send({
            from: from_email,
            to: to_email,
            subject: subject,
            html: `${EmailTemplate(body)}`,
          });
        
          if (error) {
            return console.error({ error });
          }
        
          console.log({ data });
    } catch (error) {
        console.error(error);
    }
}

export { sendEmail }