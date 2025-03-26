interface SendEmail {
    from_email : string;
    to_email : string;
    subject : string
    body : EmailTemplateProps
}

interface EmailTemplateProps {
    recipientFirstname : string;
    recipientLastname : string;
    subject : string;
    message : string; // Email body
}

export type { SendEmail, EmailTemplateProps }