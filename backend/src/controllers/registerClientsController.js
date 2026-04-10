import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt"; 

import clientModel from "../models/clientModel.js";

import {config} from "./config.js";

//Creo un array de funciones
const registerClientsController = {};

registerClientsController.registerClient = async (req, res) => {
  try {
    //1 solicitar todos los datos a guardar
    let { name, 
        lastName, 
        birthdate,
         email,
        password,
        isVerified,
        loginAttemps,
        timpeOut 
    } = req.body;

    const existingClient = await clientModel.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = new clientModel({
      name,
      lastName,
      birthdate,
      email,
      password: passwordHash,
      isVerified: isVerified || false,
      loginAttemps,
      timpeOut,
    });

    await newClient.save();

    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Guardamos este codigo en un token
    const tokenCode = jsonwebtoken.sign(
        //Que vamos a guardar?
        { email, verificationCode }, 
        //Secret key
        config.JWT.secret,
        //Cuando expira
         { expiresIn: "15m" }
        );

        res.cookie("verificationTokenCookie", tokenCode, {
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: ,
            pass: 
          }
        });

  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({ message: "Error registering client" });
    }
};
