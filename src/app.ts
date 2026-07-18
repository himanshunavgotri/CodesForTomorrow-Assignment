import express from "express";
import weatherRoute from "./routes/weatherRoute"

const app = express();
app.use(express.json());

app.use('/analytics', weatherRoute)
// app.post('/analytics', (req,res) => {
//     res.json({
//         data: 'msg'
//     })
// })

export default app;