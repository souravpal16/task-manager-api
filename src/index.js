const express = require('express');
require('./db/mongoose');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.listen(PORT, ()=>{
    console.log(`server is up on port ${PORT}`);
});