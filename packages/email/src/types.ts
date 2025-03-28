interface SendEmail {
    from: string;
    to: string[];
    subject: string;
    html?: string; 
}

export type { SendEmail }