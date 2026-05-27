import 'dotenv/config'
import app from './app.js'
import  connectDB  from './config/db.js'
import questionRoutes from './routes/question.routes.js'

const port = Number(process.env.PORT) || 3000

try {
  await connectDB()

  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
} catch (error) {
  console.error(`Server startup failed: ${error.message}`)
  process.exit(1)
}
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
process.nextTick(() => {
  if (typeof app !== "undefined") {
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
      }
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }

      return next();
    });
    app.use("/auth", authRoutes);
    app.use('/api/questions', questionRoutes);

    app.use("/", protectedRoutes);
  }
});
