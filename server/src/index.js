import 'dotenv/config'
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const port = process.env.PORT;
        console.log("🔍 process.env.PORT =", process.env.PORT);
        if (!port) {
            throw new Error("❌ PORT is not defined. Are you running this in Render?");
        }
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((err) => {
        console.log("Database Connection Failed!!", err);
    })