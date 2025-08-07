import 'dotenv/config'
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
    const port = process.env.PORT || 8000;
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch((err)=>{
    console.log("Database Connection Failed!!",err);
})