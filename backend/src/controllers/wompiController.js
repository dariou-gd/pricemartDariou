import fetch from "node-fetch";
import { config } from "../config.js";

//Array de funciones
const wompiController = {}

wompiController.generarToken = async (req, res) => {
    try {
        const response = await fetch("https://id.wompi.sv/connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            bosy: new URLSearchParams({
                grant_type: config.wompi.grant_type,
                audience: config.wompi.audience,
                client_id: config.wompi.client_id,
                client_secret: config.wompi.client_secret,
            })
        })

        if(!response.ok){
            const error = await response.text()
            return res.status(500).json({error})
        }

        const data = await response.json();
        return res.status(200).json({data})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})      
    }
}

wompiController.paymentTest = async (req, res) => {
    try {
        const {token, formData} = req.body

        const response = await fetch(
            "https://api.wompi.sv/transaccionCompra/TokenizadaSin3Ds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Autorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }
        )

        if(!PaymentResponse.ok){
            const error = await response.text()
            return res.status(500).json({error})
        }

        const data = await response .json()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

wompiController.payment3ds = async (req, res) => {
    try {
        const {token, formData} = req.body
        const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
            method: "POST",
            haders: {
                "Content-Type": "application/json",
                Autorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData)
        })

        if(!response.ok) {
            const error = await response.text()
            return res.status(500).json({error});
        }

        const data = await response.json()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }
}

export default wompiController;