const express=require('express');
const router=express.Router();

const {createTodo,getTodos,getParticularTodos,updateTodo,deleteTodo}=require('../controllers/todoControllers');
const validateTodo=require('../middlewares/validateTodo');

router.post('/',validateTodo,createTodo);
router.get('/', getTodos); 
router.get('/:id',getParticularTodos);
router.put('/:id',validateTodo,updateTodo);
router.delete('/:id',deleteTodo);

module.exports=router;