const sampleCode = `import { EzySend } from "ezysend";

const ezysend = new EzySend(nt_111222333);

(async function() {
  const response = await ezysend.sendEmail({
    toEmail : 'example@ezysend.com',
    body : {
        recipientFirstname : 'Test Email Ezysend',
        recipientLastname : 'Ezysend',
        subject : 'Testing Email from Ezysend',
        message : 'Effortless Email & Notification API for Developers'
    }
  });
  console.log("Email Response:", response);
})();`

export { sampleCode };