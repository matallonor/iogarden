const { Op } = require('sequelize');

const CompositionMapper = require('./CompositionMapper');

function parseWhereQuery(whereQ) {
  const compositionWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }
  if ('catalog' in whereQ) {
    compositionWhere.catalog = {
      [Op.like]: `%${whereQ.catalog}%`,
    };
  }
  if ('title' in whereQ) {
    compositionWhere.title = {
      [Op.like]: `%${whereQ.title}%`,
    };
  }

  return { compositionWhere, otherWhere };
}

class CompositionRepository {
  constructor({
    CompositionModel, OwnershipShareModel, CollectionShareModel, UserModel, sequelize,
  }) {
    this.CompositionModel = CompositionModel;
    this.OwnershipShareModel = OwnershipShareModel;
    this.CollectionShareModel = CollectionShareModel;
    this.UserModel = UserModel;
    this.sequelize = sequelize;
  }

  async getAll({ offset = 0, limit = 20 }, whereQ) {
    const { compositionWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: compositionWhere,
    };

    try {
      const compositions = await this.CompositionModel.findAll(options);
      return compositions.map(CompositionMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async getAllCompositionsFromRightHolder({ offset = 0, limit = 20 }, userId) {
    try {
      const options = {
        offset,
        limit,
        include: [
          {
            model: this.OwnershipShareModel,
            as: 'ownershipShares',
            include: [{ model: this.UserModel, as: 'owner' }],
          },
          {
            model: this.CollectionShareModel,
            as: 'collectionShares',
            include: [{ model: this.UserModel, as: 'rightHolder' }],
          },
        ],
        where: {
          id: {
            $in: this.sequelize.literal(
              `(SELECT "compositionId" FROM "CollectionShares" "cs" WHERE "cs"."rightHolderId" = '${userId}')`,
            ),
          },
        },
      };

      /* const compositions = await this.sequelize.query(
        `SELECT * FROM "Compositions" "c"
         JOIN "CollectionShares" "cs" ON "cs"."compositionId" = "c"."id"
         JOIN "Users" "u" ON "u"."id" = "cs"."rightHolderId"
         WHERE "cs"."rightHolderId" = '${userId}'`, options,
      ); */

      const compositions = await this.CompositionModel.findAll(options);
      console.log(compositions);
      return compositions;

      // console.log(compositions[0]);
      // return compositions[0];
    } catch (error) {
      throw error;
    }
  }

  async countAllCompositionsFromRightHolder(userId) {
    try {
      return 0;
      const count = await this.sequelize.query(
        `SELECT count(*) FROM "Compositions" "c"
         JOIN "CollectionShares" "cs" ON "cs"."compositionId" = "c"."id"
         JOIN "Users" "u" ON "u"."id" = "cs"."rightHolderId"
         WHERE "cs"."rightHolderId" = '${userId}'`,
      );
      return count[0][0].count;
    } catch (error) {
      throw error;
    }
  }

  async get(compositionId) {
    try {
      const composition = await this.CompositionModel.findById(compositionId);
      return composition;
    } catch (error) {
      throw error;
    }
  }

  async create(compositionData) {
    try {
      const composition = await this.CompositionModel.create(compositionData);
      return composition;
    } catch (error) {
      throw error;
    }
  }

  async update(id, compositionData) {
    try {
      const composition = await this.CompositionModel
        .update(compositionData, { where: { id } });
      return composition;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const composition = await this.CompositionModel.findById(id);
      if (!composition) {
        return Promise.reject(new Error('NotFoundError'));
      }
      await composition.destroy();
      return composition;
    } catch (error) {
      throw error;
    }
  }

  async count(whereQ) {
    try {
      const { compositionWhere } = parseWhereQuery(whereQ);
      return await this.CompositionModel.count({ where: compositionWhere });
    } catch (error) {
      throw error;
    }
  }

  async hasRightHolder(compositionId, ownerId) {
    try {
      const collectionShares = await this.CompositionModel.findAll({ where: { compositionId, ownerId } });
      return collectionShares.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CompositionRepository;
