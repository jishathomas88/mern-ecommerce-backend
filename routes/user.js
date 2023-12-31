const router=require("express").Router();
const User = require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken")

router.put('/:id',verifyTokenAndAuthorization,async(req,res)=>{
    if(req.body.password){
    req.body.password=
        CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET)
        .toString()
    }
    try{
   const updatedUser=await User.findByIdAndUpdate(req.user.id,{
    $set:req.body
   },{new:true}) 
   return res.status(201).json(updatedUser)
}catch(error){
    return res.status(500).json(error)
}

})

//DELETE
router.delete('/:id',verifyTokenAndAuthorization,async(req,res)=>{
try{
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json("User has been deleted")

}catch(error){
return res.status(500).json(error)
}
})


//GET USER
router.get('/find/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
      const user =await User.findById(req.params.id)
      const {password,...others}=user._doc
        return res.status(200).json(others)
    
    }catch(error){
    return res.status(500).json(error)
    }
    })

    //GET ALL USERS
    router.get('/',verifyTokenAndAdmin,async(req,res)=>{
        try{
            const query=req.query.new
          const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find()
          
            return res.status(200).json(users)
        
        }catch(error){
        return res.status(500).json(error)
        }
        })
        //GET STATS
        router.get('/stats',verifyTokenAndAdmin,async(req,res)=>{
            const date=new Date();
            const lastyear=new Date(date.setFullYear(date.getFullYear() - 1))
            try{
                const data=await User.aggregate([
                    { $match : { createdAt : { $gte : lastyear }}},
                    {
                        $project: {
                            month : { $month : "$createdAt"}
                        }
                    },
                    {
                        $group : {
                            _id : "$month",
                            totalUsers :{ $sum : 1}
                        }
                    }
                    
                ]);
             return res.status(200).json(data)
            }catch(error){
                return res.status(500).json(error)
            }
        })
    


module.exports=router;