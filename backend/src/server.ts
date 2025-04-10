import { app } from "./app";
import { env } from "./env";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(env.PORT, () => {
  console.log("Server is running on port 3000");
});
