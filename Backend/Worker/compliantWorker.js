const { Worker } = require("bullmq");
const mongoose = require("mongoose");

const { redisClientQueue } = require("../Config/redisQueue");

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

                imageUrl: (complaint.imageUrl && complaint.imageUrl.length > 0) ? complaint.imageUrl[0] : null,

                departments,

            });

            console.log("AI RESULT :", aiResult);

          

            const session = await mongoose.startSession();

            try {

                await session.withTransaction(async () => {

                    

                    const complaintDoc = await Complaint.findById(complaintId)
                        .session(session);

                    if (!complaintDoc) {

                        throw new Error("Complaint Not Found");

                    }

                    

                    complaintDoc.category = aiResult.category;
                    complaintDoc.priority = aiResult.priority;
                    complaintDoc.aiSummary = aiResult.summary;

                    if (!aiResult.isMatching) {

                        complaintDoc.status = "ADMIN_REVIEW";

                        await complaintDoc.save({ session });

                        return;

                    }

                  
                    const selectedDepartment = departments.find(
                        department =>
                            department.name.toLowerCase() === (aiResult.department || "").toLowerCase() ||
                            department.name.toLowerCase().includes((aiResult.department || "").toLowerCase()) ||
                            (aiResult.department || "").toLowerCase().includes(department.name.toLowerCase())
                    );

                    if (!selectedDepartment) {

                        complaintDoc.status = "PENDING";

                        await complaintDoc.save({ session });

                        return;

                    }

                    complaintDoc.department = selectedDepartment._id;


                    const official = await User.findOne({

                        role: "Official",

                        department: selectedDepartment._id,

                        leaveStatus: "AVAILABLE",

                    })
                        .sort({
                            assignComplainCount: 1,
                        })
                        .session(session);


                    if (!official) {

                        complaintDoc.status = "PENDING";

                        await complaintDoc.save({ session });

                        return;

                    }

                    

                    complaintDoc.assignedOfficial = official._id;

                    complaintDoc.status = "ASSIGNED";

                    official.assignComplainCount++;

                  

                    await official.save({ session });

                    await complaintDoc.save({ session });

                });

            }
            finally {

                await session.endSession();

            }

            console.log("Complaint Processed Successfully");

        }

        catch (err) {

            console.log(err);

            throw err;

        }

    },

    {

        connection: redisClientQueue,

        concurrency: 5,

    }

);

complaintWorker.on("completed", (job) => {

    console.log(`Job ${job.id} Completed`);

});

complaintWorker.on("failed", (job, err) => {

    console.log(`Job ${job.id} Failed`);

    console.log(err.message);

});

module.exports = complaintWorker;