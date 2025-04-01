interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  userId: number;
  apikeylogId: string;
}

interface SMSPayload {
  phoneNumber: string;
  message: string;
  userId: number;
  apikeylogId: string;
}

export type { EmailPayload, SMSPayload };
