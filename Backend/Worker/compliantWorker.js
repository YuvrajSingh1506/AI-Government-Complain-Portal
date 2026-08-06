const { Worker } = require("bullmq");

const { redisQueueOptions } = require("../Config/redisQueue");
const { getIO } = require("../Config/socketManager");

const Complaint = require("../Models/Complain");
const Department = require("../Models/Department");
const User = require("../Models/User");

const { analyzeComplaint } = require("../Utils/Gemini");

const complaintWorker = new Worker(
    "complaintQueue",

    async (job) => {

        const { complaintId } = job.data;

        try {

            const complaint = await Complaint.findById(complaintId);

            if (!complaint) {
                throw new Error("Complaint Not Found");
            }

            const departments = await Department.find({});

            if (!departments.length) {
                throw new Error("No Departments Available");
            }

            const aiResult = await analyzeComplaint({

                title: complaint.title,

                description: complaint.description,

                imageUrl:
                    complaint.imageUrl && complaint.imageUrl.length > 0
                        ? complaint.imageUrl[0]
                        : null,

                departments,

            });

            console.log("AI RESULT:", aiResult);

            if (aiResult) {
                if (aiResult.category) {
                    complaint.category = aiResult.category;
                }
                if (aiResult.priority) {
                    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
                    const upperPriority = String(aiResult.priority).toUpperCase();
                    complaint.priority = validPriorities.includes(upperPriority)
                        ? upperPriority
                        : "MEDIUM";
                }
                if (aiResult.summary) {
                    complaint.aiSummary = aiResult.summary;
                }
            }

            if (!aiResult || !aiResult.isMatching) {

                complaint.status = "ADMIN_REVIEW";

                await complaint.save();

                console.log("Complaint sent for Admin Review");

                return;
            }

            const targetDeptName = (aiResult.department || "").trim().toLowerCase();

            const selectedDepartment = departments.find((department) => {

                const dbName = department.name.trim().toLowerCase();

                return (
                    dbName === targetDeptName ||
                    dbName.includes(targetDeptName) ||
                    targetDeptName.includes(dbName)
                );

            });
            if (!selectedDepartment) {

                complaint.status = "PENDING";

                await complaint.save();

                console.log("Department Not Found");

                return;
            }

            complaint.department = selectedDepartment._id;

            const official = await User.findOne({

                role: "Official",

                department: selectedDepartment._id,

                leaveStatus: "AVAILABLE",

            }).sort({

                assignComplainCount: 1,

            });

            if (!official) {

                complaint.status = "PENDING";

                await complaint.save();

                console.log("No Official Available");

                return;
            }

            complaint.assignedOfficial = official._id;
            complaint.status = "ASSIGNED";

            official.assignComplainCount += 1;

            await official.save();
            await complaint.save();
            const updatedComplaint = await Complaint.findById(complaint._id)
                .populate("citizen")
                .populate("department")
                .populate("assignedOfficial");
            const io = getIO();
            if (io) {
                console.log("Sending complain to :",official._id);
                io.to(official._id.toString()).emit(
                    "newComplaintAssigned",
                    {
                        message: "A new complaint has been assigned to you.",
                        complaint : updatedComplaint,
                    }
                );
                io.to(complaint.citizen.toString()).emit(
                    "complainStatusUpdated",
                    {
                        message : "Complain is assigned",
                        complaint : updatedComplaint,
                    }
                )
                io.to("admins").emit(
                    "newComplaintCreated",
                    {
                        message : "Complain Updted",
                        complain : updatedComplaint
                    }
                )
                // console.log("automation");
            }

            console.log("Complaint Assigned Successfully");

        }
        catch (err) {

            console.error("Worker Processing Error:", err);

            throw err;

        }

    },

    {

        connection: redisQueueOptions,

        concurrency: 5,

    }

);

complaintWorker.on("completed", (job) => {

    console.log(`Job ${job.id} Completed`);

});

complaintWorker.on("failed", (job, err) => {

    console.log(`Job ${job.id} Failed:`, err ? err.message : "Unknown Error");

});

module.exports = complaintWorker;