const express = require('express');
const app = express();
var cors = require('cors')
const dbConnect = require('./utils/db');
const cookieParser = require('cookie-parser')

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://dev-tinder-front-51s14uu9u-gouravs-projects-a51696b2.vercel.app',
  credentials: true 
}));

const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request');
const userRouter = require('./router/userRouter');

app.get("/",(req,res)=>{
    res.send("this is server side");
})

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


dbConnect()
.then(res =>{ 
    console.log("connected to server " )
    app.listen(3000,()=>{
        console.log
    })
})
.catch(err => console.log(err));
