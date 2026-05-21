import providerModel from "../models/providers.js"
import {v2 as cloudinary} from "cloudinary";

const providersController = {};

providersController.getAllProviders = async (req, res) => {
    try {
        const providers = await providerModel.find()
        return res.status(200).json(providers)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

providersController.insertProvider = async (req, res) =>{
    try {
            const {name, phone } = req.body;
 
            const newProvider = new providerModel({
                name,
                phone,
                image: req.file.path,
                public_id: req.file.filename
            })
 
            await newProvider.save();
 
            return res.status(200).json({message: "Provider save"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({ message: "Internal server error"})
    }
};

providersController.deleteProvider = async (req, res) =>{
    try {
        const providerFound = await providerModel.findById(req.params.id);
        
        await cloudinary.uploader.destroy(providerFound.public_id);

        await providerModel.findByIdAndDelete(req.paramas.id)

        return res.status(200).json({message: "Provider found"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({ message: "Internal server error"})
    }
};

providersController.updateProvider = async (req, res) =>{
    try {
        const {name, phone} = req.body

        const providerFound = await providerModel.findById(req.params.id);

        const updatedData = {
            name,
            phone
        }

        if(req.file){
            await cloudinary.uploader.destroy(providerFound.public_id)

            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename
        }

        await providerModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        )

        return res.status(200).json({message: "Provider updated"})
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({ message: "Internal server error"})
    }
};



export default providersController;