const express =require("express");
const {readdirSync}=require("fs")
const app =express();
const dotenv=require("dotenv")
const mongoose=require("mongoose")
// cors 
const cors=require('cors')
const options={
    origin:'http://localhost:3000',
    useSuccessStatus:200
}
app.use(cors(options))
//env 
dotenv.config()
//database 
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
}).then(()=>{
    console.log("connnect db success")
})
.catch(()=>console.log("connnect db error "))

app.use(express.json())

app.get('/',(req,res)=>{
res.send("welcome to home")
})
readdirSync("./routes").map((r)=>app.use("/",require("./routes/"+r)))
app.listen(process.env.PORT,()=>{
    console.log("server is listering....");
})