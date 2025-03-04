import express from "express";
import cors from "cors"
import fruitRouter from "./routes/fruit.route";
import orderRouter from "./routes/order.route";
import tagRouter from "./routes/tag.route";
import fruitCarsouelRouter from "./routes/fruit-carsouel.route";
const app = express()

const PORT = 3000

app.use(express.json())
app.use(cors())
app.use('/fruits', fruitRouter)
app.use('/order', orderRouter)
app.use('/tag', tagRouter)
app.use('/carsouel', fruitCarsouelRouter)

app.listen(PORT, () => {
    console.log("Hello world!");
})
