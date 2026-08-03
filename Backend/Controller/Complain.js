const Complain = require("../Models/Complain");
const Department = require("../Models/Department");
const User = require("../Models/User");
const { analyzeComplaint } = require("../Utils/Gemini");
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
         const departments = await Department.find({});

        if (!departments || departments.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No departments are available",
            });
        }
        let imageUrl = [];
        const image = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
        imageUrl.push(image.secure_url);

         let aiResult = null;

        if (file) {

            aiResult = await analyzeComplaint({

                title,

                description,

                imagePath: file.tempFilePath,

                imageMimeType: file.mimetype,

                departments,
            });

        } else {

            aiResult = await analyzeComplaint({

                title,

                description,

                imagePath: null,

                imageMimeType: null,

                departments,
            });
        }

        console.log("AI RESULT:", aiResult);
        // if(aiResult.isMatching === false){
        //     return res.status(400).json({
        //         success : false,
        //         message : "Image and text do not match",
                
        //     })
        // }
        const selectedDepartment = {
            _id: null
        };
        let assignedOfficialId = null;
        let complaintStatus = "PENDING";
        if(aiResult.isMatching == true){
            const selectedDepartment = departments.find(
            (department) =>
                department.name.toLowerCase() ===
                aiResult.department.toLowerCase()
        );

            if (!selectedDepartment) {
                return res.status(500).json({
                    success: false,
                    message: "AI returned an invalid department",
                });
            }

            // Automatically assign complaint to official in identified department with least complaints
            const official = await User.findOne({
                role: "Official",
                department: selectedDepartment._id,
                leaveStatus:"AVAILABLE"
            }).sort({
                assignComplainCount: 1,
            });

           

            if (official) {
                assignedOfficialId = official._id;
                complaintStatus = "ASSIGNED";
                official.assignComplainCount += 1;
                await official.save();
            }
        }

        const complaint = await Complain.create({
            title,
            description,
            imageUrl,
            citizen: user,
            department: selectedDepartment._id,
            category: aiResult.category,
            priority: aiResult.priority,
            assignedOfficial: assignedOfficialId,
            status: complaintStatus,
            location: {
                latitude: latitude || null,
                longitude: longitude || null,
                address: address || "",
            },
            aiSummary: aiResult.summary,
        });

        return res.status(201).json({
            success: true,
            message: official
                ? "Complaint created and automatically assigned to official"
                : "Complaint created successfully (pending official assignment)",
            complain: complaint,
            aiAnalysis: {
                category: aiResult.category,
                priority: aiResult.priority,
                department: selectedDepartment.name,
                summary: aiResult.summary,
                assignedOfficial: official ? official.name : "Not assigned",
            },
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : err.message ||"Something went wrong while creating the complain",
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