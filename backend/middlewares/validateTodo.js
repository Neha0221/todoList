const {Validator}=require('node-input-validator');

const validateTodo=async(req,res,next)=>{
    const v = new Validator(req.body, {
        title: 'required|string|minLength:3',
        status: 'in:Todo,In Progress,Completed' // only allow specific status values
    });

    const matched=await v.check();

    if(!matched){
        return res.status(422).json({message:'Validation Failed',errors:v.errors});
    }

    next();
}


module.exports=validateTodo;