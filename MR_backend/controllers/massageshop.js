const MassageShop = require('../models/MassageShop');
const User = require('../models/User');
// const vacCenter = require('../models/VacCenter');


//@desc     Get vaccine centers
//@route    GET /api/v1/hospitals/vacCenters/
//@access   Public
// exports.getVacCenters = async(req,res,next)=>{
    
//     vacCenter.getAll((err,data)=>{
//         if(err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving Vaccine Centers."
//             });
//         else res.send(data);
//     });
// };



//@desc     Get all massages
//@route    GET /api/v1/massageShops
//@access   Public
exports.getMassageShops = async(req, res, next)=>{
    let query;

    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select','sort','page','limit'];

    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = MassageShop.find(JSON.parse(queryStr)).populate(`appointments`);

    //Select Fields
    if(req.query.select)    {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort)  {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await MassageShop.countDocuments();

    query = query.skip(startIndex).limit(limit);


    try {
        //Executing query
        const massageShops = await query;
        //Pagination result
        const pagination = {};

        if(endIndex < total)    {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0)  {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        
        res.status(200).json({
            success:true,
            count:massageShops.length,
            data:massageShops
        });
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Get single hospitals
//@route    GET /api/v1/massageShops/:id
//@access   Public
exports.getMassageShop = async (req, res, next)=> {
    try {
        const massageShop = await MassageShop.findById(req.params.id);
        
        if(!massageShop)   {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:massageShop});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Create new massageShop
//@route    POST /api/v1/massageShops
//@access   Private
exports.createMassageShop = async (req, res, next)=> {
    try{
        const {name,address,district,province,postalcode,tel,region} = req.body;

        const user = await User.findById(req.user.id);

        const owner = user.id;
        const verify = user.role === 'admin' ? true : false;
        //Create massageShop  
        const massageShop = await MassageShop.create({
            name,
            address,
            district,
            province,
            postalcode,
            tel,
            region,
            owner,
            verify
        });
        res.status(201).json({
            success:true,
            data:massageShop
        });

    } catch (err) {
        res.status(400).json({success:false});
        console.log(err.stack);
    }

};

//@desc     Update massageShop
//@route    PUT /api/v1/massageShops/:id
//@access   Private
exports.updateMassageShop = async (req, res, next)=> {
    try{
        const massageShop = await MassageShop.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });
        
        if(!massageShop)   {
            return res.status(400).json({success:false});
        }   

        res.status(200).json({success:true,data:massageShop});
    } catch (err) {
        res.status(400).json({success:false});
    }

};

//@desc     Verify massageShop
//@route    PUT /api/v1/massageShops/:id/verify
//@access   Private
exports.verifyMassageShop = async (req, res, next)=> {
    try{
        const massageShop = await MassageShop.findById(req.params.id);

        if(!massageShop)   {
            return res.status(400).json({success:false});
        }

        massageShop.verify = true;
        massageShop.save();

        res.status(200).json({success:true,data:massageShop});
    } catch (err) {
        res.status(400).json({success:false});
    }
};


//@desc     Delete all massageShops
//@route    DELETE /api/v1/massageShops/:id
//@access   Private
exports.deleteMassageShop = async(req, res, next)=> {
    try{

        const massageShop = await MassageShop.findById(req.params.id);
        // check if admin or owner
        if(massageShop.owner.toString() !== req.user.id && req.user.role !== 'admin')    {
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to delete this massageShop`
            });
        }

        if(!massageShop)   {
            return res.status(400).json({
                success:false,
                message:`id ${req.params.id} not found`
            });
        }
        
        massageShop.remove();
        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status(400).json({success:false});
    }

};

