const mongoose = require("mongoose");

const complainSchema = mongoose.Schema(
    {
        title:{
            type : String,
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        location: {
            latitude: {
                type: Number,
                required: true,
            },

            longitude: {
                type: Number,
                required: true,
            },

            address: {
                type: String,
                default: "",
            }
        },
        imageUrl : [{
            type : String,
            required : true,
        }],
        additionalImageUrl : [{
            type : String,
        }],
        department :{
            type : mongoose.Schema.Types.ObjectId,
            ref :"Department",
            default : null,
        },
        priority : {
            type : String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        },
        category : {
            type : String,
            default : null,
        },
        citizen : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        assignedOfficial: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        rejectionReason: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: [
                "PENDING",
                "ASSIGNED",
                "IN_PROGRESS",
                "RESOLVED",
                "REJECTED",
            ],
            default: "PENDING",
        },
        resolutionNote : {
            type : String,
            default : null,
        },
        resolutionImages :[{
            type : String,
        }]
    },
    {
        timestamps : true,
    });

module.exports = mongoose.model("Complain",complainSchema);