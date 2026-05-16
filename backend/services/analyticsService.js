const Report = require('../models/Report');

const getLeaderboard = async (filters) => {
  const matchStage = {};
  if (filters.week) matchStage.week = filters.week;
  // Can add month matching logic here if needed

  return await Report.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$userId',
        role: { $first: '$role' },
        reportCount: { $sum: 1 },
        dataArray: { $push: { $objectToArray: '$data' } }
      }
    },
    {
      $project: {
        role: 1,
        reportCount: 1,
        data: {
          $reduce: {
            input: '$dataArray',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] }
          }
        }
      }
    },
    { $unwind: '$data' },
    {
      $group: {
        _id: { userId: '$_id', key: '$data.k' },
        role: { $first: '$role' },
        reportCount: { $first: '$reportCount' },
        totalValue: { $sum: { $toDouble: '$data.v' } }
      }
    },
    {
      $group: {
        _id: '$_id.userId',
        role: { $first: '$role' },
        reportCount: { $first: '$reportCount' },
        achievements: {
          $push: {
            k: '$_id.key',
            v: '$totalValue'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'roleconfigs',
        localField: 'role',
        foreignField: 'roleName',
        as: 'roleConfig'
      }
    },
    { $unwind: { path: '$roleConfig', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        role: 1,
        reportCount: 1,
        achievements: 1,
        fields: '$roleConfig.fields'
      }
    },
    {
      $addFields: {
        scoreDetails: {
          $map: {
            input: {
               $filter: {
                 input: { $ifNull: ['$fields', []] },
                 as: 'f',
                 cond: { $gt: ['$$f.target', 0] }
               }
            },
            as: 'field',
            in: {
               $let: {
                 vars: {
                   ach: {
                     $arrayElemAt: [
                       {
                         $filter: {
                           input: '$achievements',
                           as: 'a',
                           cond: { $eq: ['$$a.k', '$$field.label'] }
                         }
                       },
                       0
                     ]
                   }
                 },
                 in: {
                   $multiply: [
                     { $divide: [ { $ifNull: ['$$ach.v', 0] }, { $multiply: ['$$field.target', '$reportCount'] } ] },
                     100
                   ]
                 }
               }
            }
          }
        }
      }
    },
    {
      $addFields: {
        score: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ['$scoreDetails', []] } }, 0] },
            then: { $avg: '$scoreDetails' },
            else: 0
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        role: 1,
        branchId: '$user.branchId',
        score: { $round: ['$score', 2] },
        reportCount: 1,
        achievements: { $arrayToObject: '$achievements' }
      }
    },
    { $sort: { score: -1 } }
  ]);
};

const getGroupedPerformance = async (byField) => {
  return await Report.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $group: {
        _id: byField === 'branch' ? '$user.branchId' : '$role',
        reportCount: { $sum: 1 },
        dataArray: { $push: { $objectToArray: '$data' } }
      }
    },
    {
      $project: {
        reportCount: 1,
        data: {
          $reduce: {
            input: '$dataArray',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] }
          }
        }
      }
    },
    { $unwind: '$data' },
    {
      $group: {
        _id: { groupKey: '$_id', key: '$data.k' },
        reportCount: { $first: '$reportCount' },
        totalValue: { $sum: { $toDouble: '$data.v' } }
      }
    },
    {
      $group: {
        _id: '$_id.groupKey',
        reportCount: { $first: '$reportCount' },
        achievements: {
          $push: {
            k: '$_id.key',
            v: '$totalValue'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        name: { $ifNull: ['$_id', 'Unknown'] },
        reportCount: 1,
        data: { $arrayToObject: '$achievements' }
      }
    }
  ]);
};

const getTargetVsAchievement = async (roleName) => {
  return await Report.aggregate([
    { $match: { role: roleName } },
    {
      $group: {
        _id: null,
        reportCount: { $sum: 1 },
        dataArray: { $push: { $objectToArray: '$data' } }
      }
    },
    {
      $project: {
        reportCount: 1,
        data: {
          $reduce: {
            input: '$dataArray',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] }
          }
        }
      }
    },
    { $unwind: '$data' },
    {
      $group: {
        _id: '$data.k',
        reportCount: { $first: '$reportCount' },
        totalValue: { $sum: { $toDouble: '$data.v' } }
      }
    },
    {
      $lookup: {
        from: 'roleconfigs',
        pipeline: [
          { $match: { roleName: roleName } }
        ],
        as: 'roleConfig'
      }
    },
    { $unwind: { path: '$roleConfig', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        metric: '$_id',
        achievement: '$totalValue',
        reportCount: 1,
        fieldInfo: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $ifNull: ['$roleConfig.fields', []] },
                as: 'f',
                cond: { $eq: ['$$f.label', '$_id'] }
              }
            },
            0
          ]
        }
      }
    },
    {
      $project: {
        metric: 1,
        achievement: 1,
        target: { $multiply: [{ $ifNull: ['$fieldInfo.target', 0] }, '$reportCount'] }
      }
    },
    {
      $project: {
        metric: 1,
        achievement: 1,
        target: 1,
        percentage: {
          $cond: {
            if: { $gt: ['$target', 0] },
            then: { $round: [{ $multiply: [{ $divide: ['$achievement', '$target'] }, 100] }, 2] },
            else: null
          }
        }
      }
    }
  ]);
};

module.exports = {
  getLeaderboard,
  getGroupedPerformance,
  getTargetVsAchievement
};
