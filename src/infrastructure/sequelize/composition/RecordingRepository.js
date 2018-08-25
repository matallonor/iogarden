const { Op } = require('sequelize');

const RecordingMapper = require('./RecordingMapper');

function parseWhereQuery(whereQ) {
  const recordingWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }
  console.log(whereQ);
  if ('compositionId' in whereQ) {
    recordingWhere.CompositionId = {
      [Op.like]: `%${whereQ.compositionId}%`,
    };
  }

  return { recordingWhere, otherWhere };
}

class RecordingRepository {
  constructor({ RecordingModel }) {
    this.RecordingModel = RecordingModel;
    this.updateOpt = { new: true };
  }

  async getAll({ offset = 0, limit = 20 }, whereQ) {
    const { recordingWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: recordingWhere,
    };

    try {
      const recordings = await this.RecordingModel.findAll(options);
      return recordings.map(RecordingMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async get(recordingId) {
    try {
      const recording = await this.RecordingModel.findById(recordingId);
      return recording;
    } catch (error) {
      throw error;
    }
  }

  async create(recordingData) {
    try {
      const recording = await this.RecordingModel.create(recordingData);
      return recording;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(recordingId, recordingData) {
    try {
      const recording = await this.RecordingModel
        .update(recordingData, { where: { recordingId } });
      return recording;
    } catch (error) {
      throw error;
    }
  }

  async delete(recordingId) {
    try {
      const isDeleted = await this.RecordingModel
        .destroy({ where: { isrc: recordingId } });
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.RecordingModel.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RecordingRepository;
