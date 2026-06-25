const Complain = require("../Models/Complain");
const User = require("../Models/User");
// const Department = require("../Models/Department");
require("dotenv").config();
const {uploadImageToCloudinary} = require("../Utils/Image_Uploader");
exports.createComplain = async(req, res) =>{
    try{
        const file = req.files?.image;
        const {title, description, longitude, latitude, address} = req.body;
        const user = req.user.id;
        if(!file || !title || !description || !latitude || !longitude || !address){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required"
                });
        }
        if(isNaN(latitude) || isNaN(longitude)){
            return res.status(400).json({
                success:false,
                message:"Invalid latitude or longitude"
            });
        }
        const existingUser = await User.findById(user);
        if(!existingUser){
            return res.status(404).json({
                success : false,
                message : "User not exists"
            })
        }
        const image = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
        const  response = await Complain.create({
            title,
            description,
            location :{
                latitude: Number(latitude),
                longitude: Number(longitude),
                address,
            },
            citizen : user,
            imageUrl : [image.secure_url],  
        })
        return res.status(200).json({
            success : true,
            message : "Complain created successfully",
            complain : response,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while creating the complain",
            error : err.message,
        })
    }
}

exports.getComplainDetail = async(req, res) =>{
    try{
        const {complainId} = req.params;
        if(!complainId){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }
        const complain = await Complain.findById(complainId)
                .populate("citizen")
                .populate("department")
                .populate("assignedOfficial");;
        if(!complain){
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }
        return res.status(200).json({
            success : true,
            message : "Complain data fetch successfully",
            complain,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching complain data",
            error : err.message,
        })
    }
}
exports.updateComplain = async (req, res) => {
    try {
        const userId = req.user.id;
        const { complainId } = req.params;
        const { title, description } = req.body || {};
        const image = req.files?.image;

        if (!complainId) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID is required",
            });
        }

        if (!title && !description && !image) {
            return res.status(400).json({
                success: false,
                message: "Please provide something to update",
            });
        }

        const complain = await Complain.findById(complainId);

        if (!complain) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }
        if (complain.citizen.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "This complaint does not belong to you",
            });
        }

        if (complain.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending complaints can be updated",
            });
        }

        if (title) {
            complain.title = title;
        }

    
        if (description) {
            complain.description = description;
        }
        
        if (image) {
            const cloudinaryResponse =
                await uploadImageToCloudinary(
                    image,
                    process.env.FOLDER_NAME
                );
          
            if (!complain.additionalImageUrl) {
                complain.additionalImageUrl = [];
            }

            complain.additionalImageUrl.push(
                cloudinaryResponse.secure_url
            );
            
        }

        const updatedComplain = await complain.save();

        return res.status(200).json({
            success: true,
            message: "Complaint updated successfully",
            updatedComplain,
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
exports.getMyComplains = async(req, res)=>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "User doesn't exists",
            })
        }
        const allComplain = await Complain.find({
            citizen : userId,
        }).populate("department")
        .populate("assignedOfficial")
        .sort({ createdAt: -1 });
        return res.status(200).json({
            success : true,
            message :"All complain reterive successfully",
            allComplain,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
            error : err.message,
        })
    }
}
exports.deleteComplain = async (req, res) => {
    try {
        const userId = req.user.id;
        const { complainId } = req.params;

        if (!complainId) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID is required",
            });
        }

        const complainDetail = await Complain.findById(complainId);

        if (!complainDetail) {
            return res.status(404).json({
                success: false,
                message: "Complaint does not exist",
            });
        }

        if (complainDetail.citizen.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Complaint does not belong to current user",
            });
        }

        if (complainDetail.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending complaints can be deleted",
            });
        }

        await Complain.findByIdAndDelete(complainId);

        return res.status(200).json({
            success: true,
            message: "Complaint deleted successfully",
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        });
    }
};