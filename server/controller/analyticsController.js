const Order = require("../models/order.js");

const getDashboardAnalytics = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Today's stats & overall AOV
    const todayMetrics = await Order.aggregate([
      {
        $facet: {
          todayStats: [
            { $match: { createdAt: { $gte: todayStart }, status: { $ne: "Cancelled" } } },
            {
              $group: {
                _id: null,
                todayRevenue: { $sum: "$totalAmount" },
                todayOrders: { $sum: 1 }
              }
            }
          ],
          pendingStats: [
            { $match: { status: "Pending" } },
            { $count: "count" }
          ],
          overallStats: [
            { $match: { status: { $ne: "Cancelled" } } },
            {
              $group: {
                _id: null,
                aov: { $avg: "$totalAmount" }
              }
            }
          ]
        }
      }
    ]);

    const todayRevenue = todayMetrics[0]?.todayStats[0]?.todayRevenue || 0;
    const todayOrders = todayMetrics[0]?.todayStats[0]?.todayOrders || 0;
    const pendingOrders = todayMetrics[0]?.pendingStats[0]?.count || 0;
    const averageOrderValue = Math.round(todayMetrics[0]?.overallStats[0]?.aov || 0);

    // 2. Revenue Trend & Orders by Day (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { date: "$createdAt", timezone: "Asia/Kolkata" } },
            month: { $month: { date: "$createdAt", timezone: "Asia/Kolkata" } },
            day: { $dayOfMonth: { date: "$createdAt", timezone: "Asia/Kolkata" } }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = daysOfWeek[d.getDay()];
      const keyYear = d.getFullYear();
      const keyMonth = d.getMonth() + 1;
      const keyDay = d.getDate();

      const dbMatch = dailyTrend.find(r => r._id.year === keyYear && r._id.month === keyMonth && r._id.day === keyDay);
      trendData.push({
        label,
        revenue: dbMatch ? dbMatch.revenue : 0,
        orders: dbMatch ? dbMatch.orders : 0
      });
    }

    // 3. Peak Ordering Hours (10 AM to 11 PM)
    const hourlyStats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $project: {
          hour: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } }
        }
      },
      {
        $group: {
          _id: "$hour",
          orders: { $sum: 1 }
        }
      }
    ]);

    const hoursList = [
      { label: '10 AM', value: 10 }, { label: '11 AM', value: 11 }, { label: '12 PM', value: 12 },
      { label: '1 PM', value: 13 }, { label: '2 PM', value: 14 }, { label: '3 PM', value: 15 },
      { label: '4 PM', value: 16 }, { label: '5 PM', value: 17 }, { label: '6 PM', value: 18 },
      { label: '7 PM', value: 19 }, { label: '8 PM', value: 20 }, { label: '9 PM', value: 21 },
      { label: '10 PM', value: 22 }, { label: '11 PM', value: 23 },
    ];
    const peakHoursData = hoursList.map(h => {
      const dbMatch = hourlyStats.find(r => r._id === h.value);
      return {
        hour: h.label,
        orders: dbMatch ? dbMatch.orders : 0
      };
    });

    // 4. Payment Method Breakdown (UPI & COD only)
    const paymentStats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: {
            $cond: { if: { $eq: ["$orderType", "Takeaway"] }, then: "UPI", else: "COD" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPaymentOrders = paymentStats.reduce((sum, r) => sum + r.count, 0) || 1;
    const paymentMethodBreakdown = paymentStats.map(r => ({
      name: r._id,
      value: Math.round((r.count / totalPaymentOrders) * 100)
    }));

    // 5. Branch Revenue Comparison (hide if only one branch)
    const branchStats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$branch",
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const branchRevenueComparison = branchStats.map(r => ({
      branch: r._id,
      revenue: r.revenue
    }));

    // 6. Top 5 Best Selling Items
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
      { $limit: 5 }
    ]);

    const topBestSellingItems = topItemsStats.map(r => ({
      name: r._id,
      totalSold: r.totalSold
    }));

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        todayOrders,
        averageOrderValue,
        pendingOrders,
        revenueDaily: trendData,
        peakHours: peakHoursData,
        paymentMethods: paymentMethodBreakdown,
        branchPerformance: branchRevenueComparison,
        topItems: topBestSellingItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboardAnalytics };
