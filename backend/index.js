const express = require("express");
require('dotenv').config();
const rootRouter = require("./routes");
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/v1",rootRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("server is running on port 3000")
})
