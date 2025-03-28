const sampleCode = `import { EzySend } from "ezysend";

const ezysend = new EzySend(nt_111222333);

(async function() {
  const response = await ezysend.sendEmail({
    from : 'example@ezysend.com',
    to: 'priyanshukumar.spam@gmail.com',
    subject : 'Testing Email from Ezysend',
    html : '<strong>hello world!</strong>'
  });
  console.log("Email Response:", response);
})();`

export { sampleCode };