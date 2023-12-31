const { verifyTokenAndAdmin } = require("./verifyToken");
const Product=require('../models/Product')

const router=require("express").Router();

//CREATE
router.post('/',verifyTokenAndAdmin,async(req,res)=>{
    const newProduct=new Product(req.body);
    try{
        const savedProduct=await newProduct.save()
        return res.status(200).json(savedProduct)

    }catch(error){
        return res.status(500).json(error)
    }
})

//UPDATE
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedProduct=await Product.findByIdAndUpdate({_id :req.params.id},{
            $set:req.body
        },{new:true})
        return res.status(201).json(updatedProduct)


    }catch(error){
        return res.status(500).json(error)
    }
})

//DELETE
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{ 
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json("Product has been deleted")
    }catch(error){
        return res.status(500).json(error)
    }
})

//GET PRODUCT
router.get('/find/:id',async(req,res)=>{
    try{
const product=await Product.findById(req.params.id)
return res.status(200).json(product)
    }catch(error){
        return res.status(500).json(error)  
    }
})

//GET ALL PRODUCTS
router.get('/',async(req,res)=>{
    try{
        const queryNew=req.query.new;
        const queryCategory=req.query.category;
        let products;
        if(queryNew){
            products=await Product.find().sort({createdAt : -1}).limit(1)
        }else if(queryCategory){
           products=await Product.find({categories : 
            {
                $in : [queryCategory]
            }
        })
        }else{
         products=await Product.find();
        }
        return res.status(200).json(products)  

    }catch(error){
        return res.status(500).json(error)  
    }
})

module.exports=router;