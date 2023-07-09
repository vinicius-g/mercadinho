import express from "express";
import router from "./app/routes/router";
import path from "path";
const app = express();

app.use(express.static(path.join(__dirname, "..", "app", "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "app", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(2405, () => {
    console.log("Rodando em: http://localhost:2405");
})