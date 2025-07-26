import 'dotenv/config'
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
    const port = process.env.PORT || 5000;
    app.listen(port, ()=>{
        console.log(`Server is running at ${port}`);
    })
})
.catch((err)=>{
    console.log("Database Connection Failed!!",err);
})