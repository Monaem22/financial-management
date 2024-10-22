const express = require("express");
const app = express();
const dbConnection = require("./config/DB_connection");
const dotenv = require("dotenv");
const Routes = require("./routes/index ");
const cookieParser = require('cookie-parser');
const cors = require("cors");


port = process.env.PORT || 4444;
dotenv.config(); 
dbConnection();
 
// app.use(cors());
// app.options( "*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/employee", express.static("./Uploads_image"));
app.use("/employee", express.static("./Uploads_Qualification_certificate"));
app.use("/employee", express.static("./Uploads_Personal_ID_card"));

app.use("/", Routes);

app.all('*',(req,res)=>{
  res.send({
      massage:"not found routes"
  })
})

// const today = new Date();
// console.log(typeof(today));
// const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
// const full = new Date(formattedDate);
// const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()+ 1);

let cc =  Date();
console.log("full :",cc);

// console.log("formattedDate " ,formattedDate);
// console.log(typeof(formattedDate));

app.listen(port, () => {
    console.log(`the server is running on port : ${ port} on  http://localhost:${port}`);
  });
  