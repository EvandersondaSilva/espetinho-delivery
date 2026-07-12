import cors from "cors";
import "dotenv/config";
import express, { NextFunction } from "express";
import routes from "./routes";
import { Request, Response } from "express";
import { AppError } from "./errors/AppError";

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
    }

    if (error instanceof Error) {
        return res.status(500).json({ error: error.message })
    }

    return res.status(500).json({ error: "Internal server error!" })
})

app.get("/", (_: Request, res: Response) => {
    res.send("API rodando 🚀");
});


const PORT = process.env.PORT! || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


