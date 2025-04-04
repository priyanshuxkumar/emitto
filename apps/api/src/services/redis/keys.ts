/** Users specific keys */
const getLoggedInUserKey = (userId: number): string => {
  return `logged-in-user:${userId}`;
};

/** Emails specific keys */
const getAllEmailsKey = (userId: number): string => {
  return `all-emails:${userId}`;
};

const getEmailDetailsKey = (emailId: string): string => {
  return `get-email-details:${emailId}`;
};

/** ApiKey Keys */
const getApiKeyDetailsKey = (apiKeyId: string): string => {
  return `api-key-details:${apiKeyId}`;
};

const getAllApiKeysKey = (userId: number): string => {
  return `all-api-keys:${userId}`;
};

const getApiKeyLogsKey = (userId : number) : string => {
  return `api-key-logs:${userId}`
}

const getApiKeyLogDetailsKey = (logId : string) : string => {
  return `api-key-log-details:${logId}`
}

export {
  getLoggedInUserKey,
  getAllEmailsKey,
  getEmailDetailsKey,
  getApiKeyDetailsKey,
  getAllApiKeysKey,
  getApiKeyLogsKey,
  getApiKeyLogDetailsKey
};
