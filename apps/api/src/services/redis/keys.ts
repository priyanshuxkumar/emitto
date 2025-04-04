/** Users specific keys */
const getLoggedInUserKey = (userId : number) : string => {
    return (`loggedInUser:${userId}`);
}

/** Emails specific keys */
const getAllEmailsKey = (userId : number) : string =>  {
    return (`allEmails:${userId}`);
} 

const getEmailDetailsKey = (emailId : string) : string => {
    return (`getEmailDetails:${emailId}`);
}

export {
    getLoggedInUserKey,
    getAllEmailsKey,
    getEmailDetailsKey
}