const {Schema,model} =require('mongoose');

const TodoSchema=new Schema(
    {
        title:{
            type: String,
            require: true,
            minLength: 3
        },
        status:{
            type:String,
            enum:['Todo','In Progress','Completed'],
            default:'Todo'
        },
        priority:{
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
        }
    },

    {timestamps:true}
);

module.exports=model('Todo',TodoSchema);
