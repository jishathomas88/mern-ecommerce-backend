const router=require("express").Router();
const { verifyToken,verifyTokenAndAdmin,verifyTokenAndAuthorization } = require("./verifyToken");
const Order=require('../models/Order')



//CREATE
router.post('/',verifyToken,async(req,res)=>{
    const newOrder=new Order(req.body);
    try{
        const savedOrder=await newOrder.save()
        return res.status(200).json(savedOrder)

    }catch(error){
        return res.status(500).json(error)
    }
})

//UPDATE
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedOrder=await Order.findByIdAndUpdate({_id :req.params.id},{
            $set:req.body
        },{new:true})
        return res.status(201).json(updatedOrder)


    }catch(error){
        return res.status(500).json(error)
    }
})

//DELETE
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{ 
        await Order.findByIdAndDelete(req.params.id)
        return res.status(200).json("Oder has been deleted")
    }catch(error){
        return res.status(500).json(error)
    }
})

//GET USER ORDER
router.get('/find/:userid',verifyTokenAndAuthorization,async(req,res)=>{
    try{
const orders=await Order.find({userId:req.params.userid})
return res.status(200).json(orders)
    }catch(error){
        return res.status(500).json(error)  
    }
})

//GET ALL ORDERS
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        
       const orders=await Order.find();
        
        return res.status(200).json(orders)  

    }catch(error){
        return res.status(500).json(error)  
    }
})

//GET MONTHLY INCOME
router.get('/income',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const productId=req.query.pid
        const date=new Date();
        const lastmonth=new Date(date.setMonth(date.getMonth()-1))
        const previousmonth=new Date(new Date().setMonth(lastmonth.getMonth()-1))
        const income=await Order.aggregate([
            { $match : { createdAt : { $gte : previousmonth },...(productId &&{
                products: { $elemMatch : { productId : productId}}
            } )}  },
            {
                $project : {
                month : { $month : "$createdAt"},
                sales : "$amount"
            }
            },
           { $group : {
             _id : "$month",
             total : { $sum : "$sales"}
            }
            },
            {
                $sort : {_id : 1}
            }
        ]);
       return res.status(200).json(income)

    }catch(error){
        return res.status(500).json(error)   
    }
})


module.exports=router;