import { app } from "./app";
import { env } from "./env";
import { setupRoutes } from "./routes/routes";

setupRoutes(app);

app.listen(env.PORT, () => {
  console.log("Server is running on port 3000");
});
