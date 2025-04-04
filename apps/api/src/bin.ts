import { app } from "."
import { config } from "./config";
import { connectRedis } from "./services/redis";

const PORT = config.port;

(async function startServer() {
    //Connect redis
    await connectRedis();

    app.listen(PORT , () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})();

