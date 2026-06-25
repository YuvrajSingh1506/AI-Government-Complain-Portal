const Complain = require("../Models/Complain");
const User = require("../Models/User");
const Department = require("../Models/Department");
exports.assignComplain = async(req,res) =>{
    try{
        const {complainId, departmentId} = req.body;
        if(!complainId || !departmentId){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }
        const complain = await Complain.findById(complainId);
        if(!complain){
            return res.status(400).json({
                success : false,
                message : "Complain not found, please try again",
            })
        }
        if (complain.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Complaint is already assigned",
            });
        }
        const departmentDetail = await Department.findById(departmentId);
        if(!departmentDetail){
            return res.status(400).json({
                success : false,
                meesage : "Department doesn't exists",
            })
        }
        const official = await User.findOne({
            role: "Official",
            department: departmentId
        })
        .sort({
            assignComplainCount: 1
        });
        if(!official){
            return res.status(404).json({
                success:false,
                message:"No official found for this department"
            });
            }
        complain.assignedOfficial = official._id;

        complain.department = departmentId;
        complain.status = "ASSIGNED";
        official.assignComplainCount += 1;
        await official.save();
        await complain.save();
        return res.status(200).json({
            success: true,
            message: "Complaint assigned successfully",
            complaint: complain,
            assignedOfficial: official,
        });
    }catch(err){
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
}
exports.rejectComplain = async (req, res) => {
    try {
        const { complainId, rejectionReason } = req.body;

        if (!complainId || !rejectionReason) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID and rejection reason are required",
            });
        }

        const complain = await Complain.findById(complainId);

        if (!complain) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        }

        if (complain.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Only pending complaints can be rejected",
            });
        }

        complain.status = "REJECTED";
        complain.rejectionReason = rejectionReason;

        const updatedComplain = await complain.save();

        return res.status(200).json({
            success: true,
            message: "Complaint rejected successfully",
            complain: updatedComplain,
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
exports.getComplainData = async(req, res) =>{
    try{
        const totalComplain = await Complain.countDocuments();
        const pendingComplain = await Complain.countDocuments({
            status : "PENDING"
        })
        const assignedComplain = await Complain.countDocuments({
            status : "ASSIGNED"
        })
        const inProgessComplain = await Complain.countDocuments({
            status : "IN_PROGRESS"
        })
        const resolvedComplain = await Complain.countDocuments({
            status : "RESOLVED"
        })
        const rejectedComplain = await Complain.countDocuments({
            status : "REJECTED",
        })

        const totalDepartment = await Department.countDocuments();

        const totalOfficial = await User.countDocuments({
            role : "Official"
        })
        const totalUser = await User.countDocuments({
            role : "Citizen"
        })
        const recentComplains = await Complain.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title status createdAt");
        return res.status(200).json({
            success : true,
            message : "All data fetch successfully",
            dashboard : {
                totalComplain : totalComplain,
                pendingComplain : pendingComplain,
                assignedComplain : assignedComplain,
                inProgessComplain : inProgessComplain,
                resolvedComplain : resolvedComplain,
                rejectedComplain : rejectedComplain,
                totalDepartment  : totalDepartment,
                totalOfficial : totalOfficial,
                totalUser : totalUser,
                recentComplains,
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching admin dashboard data",
            error : err.message,
        })
    }
}

exports.getAllComplains = async(req, res) =>{
    try{
        const complains = await Complain.find()
        .populate("citizen")
        .populate("department")
        .populate("assignedOfficial")
        .sort({createdAt : -1})
        return res.status(200).json({
            success:true,
            message:"All complaints fetched successfully",
            complains,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message :"Something went wrong while fetching detail of all complain",
            error : err.message,
        })
    }
}

// exports.reassignComl