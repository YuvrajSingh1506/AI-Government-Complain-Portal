const Complain = require("../Models/Complain");
const User = require("../Models/User");
const {uploadImageToCloudinary}=require("../Utils/Image_Uploader");
exports.getAssignedComplain = async (req, res) => {
    try {
        const userId = req.user.id;

        const complain = await Complain.find({
            assignedOfficial: userId,
        })
        .populate("citizen")
        .populate("department")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All complaints fetched successfully",
            complain,
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


exports.updateComplainStatus = async (req, res) => {
    try {
        const { complainId, currentStatus, resolutionNote } = req.body;
        const officialId = req.user.id;

        // Validation
        if (!complainId || !currentStatus) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID and status are required",
            });
        }

        // Find complaint
        const complain = await Complain.findById(complainId);

        if (!complain) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        // Check complaint belongs to logged in official
        if (
            !complain.assignedOfficial ||
            complain.assignedOfficial.toString() !== officialId
        ) {
            return res.status(403).json({
                success: false,
                message: "This complaint is not assigned to you",
            });
        }

        // Valid transitions
        const validTransitions = {
            ASSIGNED: ["IN_PROGRESS"],
            IN_PROGRESS: ["RESOLVED"],
        };

        if (
            !validTransitions[complain.status] ||
            !validTransitions[complain.status].includes(currentStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${complain.status} to ${currentStatus}`,
            });
        }

        // If resolving complaint
        if (currentStatus === "RESOLVED") {

            if (!resolutionNote) {
                return res.status(400).json({
                    success: false,
                    message: "Resolution note is required",
                });
            }

            if (!req.files || !req.files.resolutionImage) {
                return res.status(400).json({
                    success: false,
                    message: "Resolution image is required",
                });
            }

            const image = req.files.resolutionImage;

            const uploadedImage = await uploadImageToCloudinary(
                image,
                process.env.FOLDER_NAME
            );

            complain.resolutionNote = resolutionNote;

            complain.resolutionImages.push(uploadedImage.secure_url);
        }

        complain.status = currentStatus;

        await complain.save();

        const updatedComplaint = await Complain.findById(complainId)
            .populate("department")
            .populate("assignedOfficial", "name email department");

        return res.status(200).json({
            success: true,
            message: "Complaint status updated successfully",
            complain: updatedComplaint,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

exports.updateLeaveStatus = async(req, res) =>{
    try{
        const user = req.user.id;
        const official = await User.findById(user);
        if(!official){
            return res.status(404).json({
                success : false,
                message : "Official not found",
            })
        } 
        if(official.leaveStatus === "AVAILABLE"){
            official.leaveStatus = "ON_LEAVE";
        }
        else{
            official.leaveStatus = "AVAILABLE";
        }
        await official.save();
        return res.status(200).json({
            success: true,
            message: `Leave status updated to ${official.leaveStatus}`,
            leaveStatus: official.leaveStatus,
            official
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while updating the status",
            error : err.message,
        })
    }
};

exports.getOfficialProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const official = await User.findById(userId).populate("department");
        if (!official) {
            return res.status(404).json({
                success: false,
                message: "Official not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Official profile fetched successfully",
            official,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching official profile",
            error: err.message,
        });
    }
};