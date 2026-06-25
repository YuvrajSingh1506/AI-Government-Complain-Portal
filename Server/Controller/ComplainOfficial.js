const Complain = require("../Models/Complain");
const User = require("../Models/User");
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
        const { complainId, currentStatus } = req.body;
        const official = req.user.id;

        if (!complainId || !currentStatus) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const complainDetail = await Complain.findById(complainId);

        if (!complainDetail) {
            return res.status(404).json({
                success: false,
                message: "Complaint doesn't exist",
            });
        }

        if (
            !complainDetail.assignedOfficial ||
            complainDetail.assignedOfficial.toString() !== official
        ) {
            return res.status(403).json({
                success: false,
                message: "This complaint is not assigned to you",
            });
        }

        const validTransitions = {
            ASSIGNED: ["IN_PROGRESS"],
            IN_PROGRESS: ["RESOLVED"],
        };

        if (
            !validTransitions[complainDetail.status] ||
            !validTransitions[complainDetail.status].includes(currentStatus)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid status transition",
            });
        }

        // If resolving complaint, require proof
        if (currentStatus === "RESOLVED") {
            const { resolutionNote } = req.body;
            const resolutionImage = req.files?.resolutionImage;

            if (!resolutionNote || !resolutionImage) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Resolution note and resolution image are required",
                });
            }

            const cloudinaryResponse =
                await uploadImageToCloudinary(
                    resolutionImage,
                    process.env.FOLDER_NAME
                );

            complainDetail.resolutionNote = resolutionNote;

            if (!complainDetail.resolutionImages) {
                complainDetail.resolutionImages = [];
            }

            complainDetail.resolutionImages.push(
                cloudinaryResponse.secure_url
            );
        }

        complainDetail.status = currentStatus;

        const response = await complainDetail.save();

        return res.status(200).json({
            success: true,
            message: "Complaint status updated successfully",
            complain: response,
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};