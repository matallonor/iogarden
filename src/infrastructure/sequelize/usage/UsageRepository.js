const { Op } = require('sequelize');

const UsageMapper = require('./UsageMapper');

function parseWhereQuery(whereQ) {
  const consumerWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }

  if ('rightHolderId' in whereQ) {
    consumerWhere.rightHolderId = whereQ.rightHolderId;
  }

  if ('compositionId' in whereQ) {
    consumerWhere.compositionId = whereQ.compositionId;
  }

  if ('type' in whereQ) {
    consumerWhere.type = {
      [Op.like]: `%${whereQ.type}%`,
    };
  }

  // TODO: filter for time periods (lastWeek, lastMonth, lastYear)
  if ('datetime' in whereQ) {
    consumerWhere.datetime = {
      [Op.like]: `%${whereQ.datetime}%`,
    };
  }

  return { consumerWhere, otherWhere };
}


class UsageRepository {
  constructor({
    UsageModel, sequelize, RecordingModel, CompositionModel, UserModel, CollectionShareModel,
  }) {
    this.UsageModel = UsageModel;
    this.sequelize = sequelize;
    this.RecordingModel = RecordingModel;
    this.CompositionModel = CompositionModel;
    this.UserModel = UserModel;
    this.CollectionShareModel = CollectionShareModel;
  }

  async getAll({ offset = 0, limit = 20 }, whereQ, orderByTerritory) {
    const { consumerWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: consumerWhere,
    };

    if (orderByTerritory) {
      options.group = [['territoryId', 'DESC']];
    }

    try {
      console.log(consumerWhere.rightHolderId);
      // const usages = await this.sequelize.query(
      //   `SELECT * FROM "Usages" "u"
      //   JOIN "Recordings" "r" ON "r"."id" = "u"."recordingId"
      //   JOIN "Compositions" "c" ON "c"."id" = "r"."compositionId"
      //   JOIN "CollectionShares" "cs" ON "cs"."compositionId" = "c"."id"
      //   JOIN "Users" "us" ON "us"."id" = "cs"."rightHolderId"
      //   WHERE "us"."id" = '${consumerWhere.rightHolderId}'`,
      // );
      const usages = await this.UsageModel.findAll({
        include: [{
          model: this.RecordingModel,
          as: 'recording',
          include: [{
            model: this.CompositionModel,
            as: 'composition',
            include: [{
              model: this.CollectionShareModel,
              as: 'collectionShares',
              include: [{
                model: this.UserModel,
                as: 'rightHolder',
                where: { id: consumerWhere.rightHolderId },
              }],
            }],
          }],
        }],
      });
      // TODO: afegir filtres i groupBy a la query

      return UsageMapper.toEntity({ dataValues: usages[0] });
    } catch (error) {
      throw error;
    }
  }

  async getAllUsagesFromComposition({ offset = 0, limit = 20 }, whereQ, orderByTerritory) {
    const { consumerWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: consumerWhere,
    };

    if (orderByTerritory) {
      options.group = [['territoryId', 'DESC']];
    }

    try {
      // const usages = await this.sequelize.query(
      //   `SELECT * FROM "Usages" "u"
      //   JOIN "Recordings" "r" ON "r"."id" = "u"."recordingId"
      //   JOIN "Compositions" "c" ON "c"."id" = "r"."compositionId"
      //   WHERE "c"."id"='${consumerWhere.compositionId}'`,
      // );
      const usages = await this.UsageModel.findAll({
        include: [{
          model: this.RecordingModel,
          as: 'recording',
          include: [{
            model: this.CompositionModel,
            as: 'composition',
            where: { id: consumerWhere.compositionId },
          }],
        }],
      });

      return UsageMapper.toEntity({ dataValues: usages[0] });
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.UsageModel.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsageRepository;
