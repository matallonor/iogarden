const Operation = require('../Operation');
const Catalog = require('../../domain/catalog/Catalog');

class CreateCatalogFromCWR extends Operation {
  constructor({
    catalogRepository, compositionRepository, ownershipShareRepository, collectionShareRepository,
  }) {
    super();
    this.catalogRepository = catalogRepository;
    this.compositionRepository = compositionRepository;
    this.ownershipShareRepository = ownershipShareRepository;
    this.collectionShareRepository = collectionShareRepository;
  }

  // TODO: refactor primaryKeys (ipi, iswc, isrc)

  async execute(user, catalogData) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;

    try {
      if (!catalogData.name || !catalogData.cwr) {
        return this.emit(VALIDATION_ERROR, new Error('ValidationError'));
      }

      const catalogInfo = {
        name: catalogData.name,
        owner: user.id,
      };
      const catalog = await this.catalogRepository.create(catalogInfo);
      const { transmission } = catalogData.cwr;

      for (let i = 0; i < transmission.groups.length; i += 1) {
        for (let j = 0; j < transmission.groups[i].transactions.length; j += 1) {
          const newComposition = {};
          const publishers = {};
          const writers = {};
          const ownershipShares = [];
          const collectionShares = [];
          for (let k = 0; k < transmission.groups[i].transactions[j].records.length; k += 1) {
            const record = transmission.groups[i].transactions[j].records[k];
            const ownershipShare = {};
            const collectionShare = {};
            switch (record.record_type) {
              case 'NWR':
              case 'REV':
                newComposition.title = record.title;
                newComposition.iswc = record.iswc;
                newComposition.type = record.text_music_relationship || 'both';
                newComposition.versionType = record.version_type || 'ORI';
                newComposition.musicArrangement = record.music_arrangement;
                newComposition.lyricAdaptation = record.lyric_adaptation;
                newComposition.language = record.language_code || null;
                break;
              case 'ALT':
                newComposition.alternateTitle = record.alternate_title;
                break;
              case 'OPU':
              case 'SPU':
                ownershipShare.pubNumber = record.publisher_sequence_n;
                ownershipShare.role = record.publisher_type;
                ownershipShare.OwnerId = record.publisher.ipi_name_n;
                ownershipShare.performanceSplit = record.pr_ownership_share;
                ownershipShare.mechanicalSplit = record.mr_ownership_share;
                ownershipShare.synchronizationSplit = record.sr_ownership_share;
                ownershipShares.push(ownershipShare);
                publishers[record.ip_n] = {
                  ipi: record.ipi_name_n,
                  name: record.publisher_name,
                };
                break;
              case 'OWR':
              case 'SWR':
                ownershipShare.role = record.writer_designation;
                ownershipShare.OwnerId = record.writer.ipi_name_n;
                ownershipShare.performanceSplit = record.pr_ownership_share;
                ownershipShare.mechanicalSplit = record.mr_ownership_share;
                ownershipShare.synchronizationSplit = record.sr_ownership_share;
                ownershipShares.push(ownershipShare);
                writers[record.ip_n] = {
                  ipi: record.ipi_name_n,
                  firstName: record.writer_first_name,
                  lastName: record.writer_last_name,
                };
                break;
              case 'SPT':
                collectionShare.RightHolderId = publishers[record.ip_n].ipi;
                collectionShare.TerritoryId = record.tis_numeric_code;
                collectionShare.performanceSplit = record.pr_collection_share;
                collectionShare.mechanicalSplit = record.mr_collection_share;
                collectionShare.synchronizationSplit = record.sr_collection_share;
                collectionShare.IEindicator = record.inclusion_exclusion_indicator;
                collectionShare.seqNumber = record.sequence_n;
                collectionShares.push(collectionShare);
                break;
              case 'SWT':
                collectionShare.RightHolderId = writers[record.ip_n].ipi;
                collectionShare.TerritoryId = record.tis_numeric_code;
                collectionShare.performanceSplit = record.pr_collection_share;
                collectionShare.mechanicalSplit = record.mr_collection_share;
                collectionShare.synchronizationSplit = record.sr_collection_share;
                collectionShare.IEindicator = record.inclusion_exclusion_indicator;
                collectionShare.seqNumber = record.sequence_n;
                collectionShares.push(collectionShare);
                break;
              case 'PWR':
                writers[record.writer_ip_n].publisher = publishers[record.publisher_ip_n].ipi;
                break;
              default:
                console.log(record.record_type);
            }
          }
          const composition = await this.compositionRepository.create(newComposition);
          let ownershipParent = null;
          for (let k = 0; k < ownershipShares.length; k += 1) {
            if (ownershipShares[k].role !== 'E') {
              ownershipShares[k].ParentId = ownershipParent;
            }
            ownershipShares[k].CompositionId = composition.iswc;
            const ownershipShare = await this.ownershipShareRepository.create(ownershipShares[k]);
            if (ownershipShares[k].role !== 'SE') {
              ownershipParent = ownershipShare.id;
            }
          }
          let collectionParent = null;
          for (let k = 0; k < collectionShares.length; k += 1) {
            if (collectionShares[k].seqNumber !== 1) {
              collectionShares[k].ParentId = collectionParent;
            }
            collectionShares[k].CompositionId = composition.iswc;
            const collectionShare = await this.collectionShareRepository.create(collectionShares[k]);
            collectionParent = collectionShare.id;
          }
          // TODO: Create process to add composition to catalogue (MANY TO MANY)
          await this.catalogRepository.addCompositionToCatalog(catalog.id, composition.id);
        }
      }


      return this.emit(SUCCESS);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

CreateCatalogFromCWR.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateCatalogFromCWR;
