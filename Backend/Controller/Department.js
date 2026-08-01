const Department = require("../Models/Department");
exports.createDepartment = async(req, res) =>{
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }
        const alreadyExits = await Department.exists({
            name : name
        })
        if(alreadyExits){
            return res.status(400).json({
                success : false,
                message :"Department already exists",
            })
        }
        const depart = await Department.create({
            name : name,
            description : description,
        })
        return res.status(200).json({
            success : true,
            department : depart, 
            message : "Department create successfully",
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while creating department",
            error : err.message,
        })
    }
}
exports.getAllDepartment = async(req,res)=>{
    try{
        const departments = await Department.find({});
        return res.status(200).json({
            success : true,
            message :"All department get fetch successfully",
            departments,
        })   
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message :"Something went wrong",
            error : err.message,
        })
    }
}
exports.updateDepartment = async(req, res) =>{
    try{
        const {deptId} = req.params;
        const {name, description} = req.body;
        if(!name && !description){
            return res.status(400).json({
                success : false,
                message : "Atleast one field required",
            })
        }
        const updates = {};

        if (name) updates.name = name;
        if (description) updates.description = description;
        const prevDept = await Department.findByIdAndUpdate(
            deptId,
            updates,
            {
                new : true,
            }
        );
          if (!prevDept) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }
        return res.status(200).json({
            success : true,
            message : "Department updated Successfully",
            department : prevDept,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
        })
    }
}
exports.deleteDepartment = async(req, res) =>{
    try{
        const {deptId} = req.params;
        const deletedDepartment = await Department.findByIdAndDelete(deptId);
         if (!deletedDepartment) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }
        return res.status(200).json({
            success : true,
            message : "Department deleted Successfully",
            department : deletedDepartment
        })
    }catch(err){
         console.log(err);
        return res.status(500).json({
            success : false,
            message : "Something went wrong",
        })
    }
}