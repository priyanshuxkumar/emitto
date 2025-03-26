(async function startEmailService() {
    while (true) {
        try {
            console.log('email sent!');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
            console.error(error);
        }
    }
})();