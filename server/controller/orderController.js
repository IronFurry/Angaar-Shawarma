const Order = require("../models/order.js")

const createOrder = async (req, res) =>{
    try{
        const order = await Order.create(req.body);

        res.status(201).json({
            success:true,
            message:"Order created successfully",
            data: order
        })
    }
    catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

const getOrder = async (req,res) =>{
    try{
        let query = {};
        if (req.user && req.user.role === 'staff' && req.user.branch) {
            query.branch = req.user.branch;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success:true,
            count:orders.length,
            data:orders
        })
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

const getOrderById = async (req,res) => {
    try{
        const id = req.params.id;
        const order = await Order.findById(id)

        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        return res.status(200).json({
                success:true,
                data:order
        })
        
    }
    catch (error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getActiveOrders = async (req, res) => {
    try {
        const query = { status: { $nin: ["Delivered", "Cancelled"] } };

        // Staff are scoped to their own branch only
        if (req.user && req.user.role === "staff" && req.user.branch) {
            query.branch = req.user.branch;
        }

        const active = await Order.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: active.length,
            data: active
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const ALLOWED_STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Delivered", "Cancelled"];
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`
        });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
                success: true,
                data: order
        })
   }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteOrder = async (req,res) =>{
    try{
        const order = await Order.findByIdAndDelete(req.params.id)
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        return res.status(200).json({
                success:true,
                data:order
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getBestsellers = async (req, res) => {
    try {
        const topItemsStats = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        const topBestSellingItems = topItemsStats.map(r => ({
            name: r._id,
            totalSold: r.totalSold
        }));

        res.status(200).json({
            success: true,
            data: topBestSellingItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {createOrder, getOrder, getOrderById, getActiveOrders,updateOrderStatus,deleteOrder, getBestsellers}