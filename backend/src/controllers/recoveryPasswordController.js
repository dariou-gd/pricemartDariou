import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import HTMLRecoveryEmail from "../utils/sendMailRecoveryPassword.js"

import { config } from "../config.js";

import customerModel from "../models/clients.js";

const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        const { email } = req.body;

        //Validar que el correo esté en la BD

        const userFound = await customerModel.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "user not found" })
        }

        //generar el número aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //Guardamos todo en un token
        const token = jsonwebtoken.sign(
            //1 ¿que vamos a guardar?
            { email, randomCode, userType: "customer", verified: false },
            //2 secret key
            config.JWT.secret,
            //3 Cuando expira
            { expiresIn: "15m" }
        )

        res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

        //Enviamos por correo el código aleatorio

        //1 ¿quien lo envía?
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //2 quien lo recibe y como
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Código de recuperación de contraseña",
            body: "El código vence en 15 minutos",
            html: HTMLRecoveryEmail(randomCode)
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("❌ Error detallado de Nodemailer:", error); // Esto aparecerá en tu terminal
                return res.status(500).json({
                    message: "Error al enviar correo",
                    detalles: error.message // Esto lo verás en Postman
                });
            }

            return res.status(200).json({ message: "email sent" });
        });



    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({ message: "Internal server error" })
    }
};

recoveryPasswordController.verifyCode = async (req, res) => {
    try {
        const { code } = req.body;

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if (code !== decoded.randomCode) {
            return res.status(400).json({ message: "Invalid code" })
        }

        //En cambio, si escribe bien el código,
        //vamos a colocar en el token que ya está verificado

        const newToken = jsonwebtoken.sign(
            //que vamos a guardar?
            { email: decoded.email, userType: "customer", verified: true },
            //secret key
            config.JWT.secret,
            //cuando expira
            { expiresIn: "15m" },
        );

        res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

        return res.status(200).json({ message: "Code verified successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
};

recoveryPasswordController.newPassword = async (req, res) => {
    try {
        //Solicito los datos
        const { newPassword, confirmNewPassword } = req.body; 

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "passwords doesnt match" })
        }

        //vamos a comprobar que el toke ya está verificado
        const token = req.cookies.recoveryCookie;
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if (!decoded.verified) {
            return res.status(400).json({ message: "code not verified" })
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await customerModel.findOneAndUpdate(
            { email: decoded.email },
            { password: passwordHash },
            { new: true },
        );

        res.clearCookie("recoveryCookie");
        return res.status(200).json({ message: "Password updated" })
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({ message: "Internal server error" })
    }
};

export default recoveryPasswordController;