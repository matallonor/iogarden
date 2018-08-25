const Composition = require('../../../domain/composition/Composition');

const CompositionMapper = {
  toEntity({ dataValues }) {
    const {
      title, language, iswc, type,
      alternateTitle, versionType, musicArrangement,
      lyricAdaptation, collectionsShares, ownershipShares,
    } = dataValues;
    return new Composition({
      title,
      language,
      iswc,
      type,
      alternateTitle,
      versionType,
      musicArrangement,
      lyricAdaptation,
      collectionsShares,
      ownershipShares,
    });
  },

  toDatabase(survivor) {
    const { name } = survivor;

    return { name };
  },
};

module.exports = CompositionMapper;
