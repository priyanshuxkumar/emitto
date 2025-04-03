interface SendEmail {
    from: string;
    to: string[];
    subject: string;
    html?: string; 
}

interface SendSMS {
    message : string;
    phoneNumber : string;
}

export type { SendEmail, SendSMS }