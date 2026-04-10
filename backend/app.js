import express from "express"
import productRoutes from "./src/routes/products.js"
import branchesRoutes from "./src/routes/branches.js"
import employeeRoutes from "./src/routes/employee.js"
import reviewsRoutes from "./src/routes/reviewsRoutes.js"
import brandsRoutes from "./src/routes/brands.js"
import adminsRoutes from "./src/routes/admins.js"
import clientsRoutes from "./src/routes/clients.js"
import registerClientsRoutes from "./src/routes/registerClients.js"
import cookieParser from "cookie-parser"

const app = express();

app.use(cookieParser());

//Que acepte JSON desde postman
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/clients", clientsRoutes)
app.use("/api/registerClients", registerClientsRoutes)


export default app;
