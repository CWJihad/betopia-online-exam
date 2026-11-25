const getCustomerOrderStats = async () => {
  return await Order.aggregate([
    {
      $group: {
        _id: '$customerId',
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer',
      },
    },
    { $unwind: '$customer' },
    {
      $project: {
        _id: 0,
        customerId: '$_id',
        name: '$customer.name',
        email: '$customer.email',
        totalOrders: 1,
        totalAmount: 1,
      },
    },
  ]);
};

const getTopFiveCustomersLastThirtyDays = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await Order.aggregate([
    {
      $match: {
        status: 'paid',
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: '$customerId',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer',
      },
    },
    { $unwind: '$customer' },
    {
      $project: {
        _id: 0,
        name: '$customer.name',
        total: 1,
      },
    },
  ]);
};


