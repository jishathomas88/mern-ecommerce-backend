const router=require("express").Router();
const { verifyToken,verifyTokenAndAdmin,verifyTokenAndAuthorization } = require("./verifyToken");
const Cart=require('../models/Cart')



//CREATE
router.post('/',verifyToken,async(req,res)=>{
    const newCart=new Cart(req.body);
    try{
        const savedCart=await newCart.save()
        return res.status(200).json(savedCart)

    }catch(error){
        return res.status(500).json(error)
    }
})

//UPDATE
router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const updatedCart=await Cart.findByIdAndUpdate({_id :req.params.id},{
            $set:req.body
        },{new:true})
        return res.status(201).json(updatedCart)


    }catch(error){
        return res.status(500).json(error)
    }
})

//DELETE
router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    try{ 
        await Cart.findByIdAndDelete(req.params.id)
        return res.status(200).json("Cart has been deleted")
    }catch(error){
        return res.status(500).json(error)
    }
})

//GET USER CART
router.get('/find/:userid',verifyTokenAndAuthorization,async(req,res)=>{
    try{
const cart=await Cart.findOne({userId:req.params.userid})
return res.status(200).json(cart)
    }catch(error){
        return res.status(500).json(error)  
    }
})

//GET ALL CARTS
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        
       const carts=await Cart.find();
        
        return res.status(200).json(carts)  

    }catch(error){
        return res.status(500).json(error)  
    }
})

module.exports=router;

module.exports=router;