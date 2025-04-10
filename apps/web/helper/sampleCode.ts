const sampleCode = `import { Emitto } from "emitto";

const emitto = new Emitto(nt_111222333);

(async function() {
  const response = await emitto.emails.send({
    from : 'example@emitto.com',
    to: 'example@gmail.com',
    subject : 'Testing Email from emitto',
    html : '<strong>hello world!</strong>'
  });
  console.log("Email Response:", response);
})();`

export { sampleCode };