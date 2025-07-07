const Todo=require('../models/todoModel');

exports.createTodo=async(req,res)=>{
    try{
        const {title, status, priority}=req.body;
        // Check for duplicate title
        const existingTodo = await Todo.findOne({ title });
        if (existingTodo) {
            return res.status(409).json({ message: 'Task with this title already exists' });
        }
        const newTodo=new Todo({
            title,
            status: status || 'Todo',
            priority: priority || 'Medium'
        });

        const savedTodo=await newTodo.save();
        res.status(201).json({message: 'Task created Successfully'});
    }catch(err){
        res.status(500).json({message:'Error creating todo',error:err.message});
    }
}

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // Get all todos, newest first
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos', error: err.message });
  }
};

exports.getParticularTodos=async (req,res)=>{
  try{
    const todos=await Todo.find(req.params);
    res.status(200).json(todos);
  }catch(err){
    res.status(500).json({message:'Error to fetch particular todos',error:err.message});
  }
};

exports.updateTodo = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, status, priority } = req.body;
  
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, status, priority },
        { new: true, runValidators: true }
      );
  
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      res.status(200).json({message: 'Task Updated Successfully'});
    } catch (err) {
      res.status(500).json({ message: 'Error updating todo', error: err.message });
    }
  };
  
  // ✅ Delete a todo by ID
  exports.deleteTodo = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedTodo = await Todo.findByIdAndDelete(id);
  
      if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      res.status(200).json({message: 'Task deleted Successfully'});
    } catch (err) {
      res.status(500).json({ message: 'Error deleting todo', error: err.message });
    }
  };