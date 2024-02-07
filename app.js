const express = require('express');
const cors = require('cors');
import UsersRoutes from "./src/routes/user.routes"
const app = express();

app.set("port", process.env.PORT || 5000);

app.use(cors())
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "esta es mi api users" });
});

app.use("/api/users", UsersRoutes);

export default app;
