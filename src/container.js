const {
  createContainer, asValue, asFunction, asClass,
} = require('awilix');

const config = require('./config/Config');

// =============================================================================
// Infrastructure
// =============================================================================
const logger = require('./infrastructure/logging/winston');

const {
  sequelize: database,
  UserModel,
  CatalogModel,
  CompositionModel,
  CatalogCompositionModel,
  RecordingModel,
  OwnershipShareModel,
  CollectionShareModel,
  ConsumerModel,
  UsageModel,
  TerritoryModel,
} = require('./infrastructure/sequelize');

// =============================================================================
// Interfaces
// =============================================================================
const Express = require('./interfaces/express/Server');
const containerMiddleware = require('./interfaces/express/middlewares/scopePerRequestMiddleware');

// =============================================================================
// Use Cases
// =============================================================================
const {
  CheckAuthCredentials,
  CheckAdminAuthCredentials,
  CheckAuthToken,
  GenerateAuthToken,
  RecoverPassword,
  ResetPassword,
} = require('./operations/auth');

const {
  CreateUser,
  DeleteUser,
  GetAllRightHolders,
  GetAllUsers,
  GetUser,
  UpdateUser,
} = require('./operations/user');

const {
  CreateCatalog,
  CreateCatalogFromCWR,
  DeleteCatalog,
  GetAllCatalogs,
  GetCatalog,
  UpdateCatalog,
  AddCompositionToCatalog,
  RemoveCompositionFromCatalog,
} = require('./operations/catalog');

const {
  AddRightHolderToComposition,
  AddOwnerToComposition,
  AddRecordingToComposition,
  CreateComposition,
  DeleteComposition,
  GetAllCompositions,
  GetComposition,
  GetCompositionRecordings,
  RemoveRightHolderFromComposition,
  RemoveOwnerFromComposition,
  RemoveRecordingFromComposition,
  UpdateComposition,
} = require('./operations/composition');

const {
  GetAllConsumers,
  GetConsumer,
} = require('./operations/consumer');

const {
  GetAllUsagesFromComposition,
  GetAllUsagesFromRightHolder,
  GetAllUsagesFromRightHolderOrderedByTerritory,
} = require('./operations/usage');

// =============================================================================
// Repositories
// =============================================================================
const UserRepository = require('./infrastructure/sequelize/user/UserRepository');
const RecordingRepository = require('./infrastructure/sequelize/composition/RecordingRepository');
const CatalogRepository = require('./infrastructure/sequelize/catalog/CatalogRepository');
const CompositionRepository = require('./infrastructure/sequelize/composition/CompositionRepository');
const OwnershipShareRepository = require('./infrastructure/sequelize/ownership-share/OwnershipShareRepository');
const CollectionShareRepository = require('./infrastructure/sequelize/collection-share/CollectionShareRepository');
const ConsumerRepository = require('./infrastructure/sequelize/consumer/ConsumerRepository');
const UsageRepository = require('./infrastructure/sequelize/usage/UsageRepository');


// =============================================================================
// Dependency injection
// =============================================================================
const container = createContainer();

// =============================================================================
// Use Cases
// =============================================================================
container.register('checkAuthCredentials', asClass(CheckAuthCredentials).transient());
container.register('checkAdminAuthCredentials', asClass(CheckAdminAuthCredentials).transient());
container.register('checkAuthToken', asClass(CheckAuthToken).transient());
container.register('generateAuthToken', asClass(GenerateAuthToken).transient());
container.register('recoverPassword', asClass(RecoverPassword).transient());
container.register('resetPassword', asClass(ResetPassword).transient());

container.register('getAllUsers', asClass(GetAllUsers).transient());
container.register('getAllRightHolders', asClass(GetAllRightHolders).transient());
container.register('getUser', asClass(GetUser).transient());
container.register('deleteUser', asClass(DeleteUser).transient());
container.register('createUser', asClass(CreateUser).transient());
container.register('updateUser', asClass(UpdateUser).transient());

container.register('getAllCatalogs', asClass(GetAllCatalogs).transient());
container.register('getCatalog', asClass(GetCatalog).transient());
container.register('deleteCatalog', asClass(DeleteCatalog).transient());
container.register('createCatalog', asClass(CreateCatalog).transient());
container.register('createCatalogFromCWR', asClass(CreateCatalogFromCWR).transient());
container.register('updateCatalog', asClass(UpdateCatalog).transient());
container.register('addCompositionToCatalog', asClass(AddCompositionToCatalog).transient());
container.register('removeCompositionFromCatalog', asClass(RemoveCompositionFromCatalog).transient());

container.register('getAllCompositions', asClass(GetAllCompositions).transient());
container.register('getComposition', asClass(GetComposition).transient());
container.register('deleteComposition', asClass(DeleteComposition).transient());
container.register('createComposition', asClass(CreateComposition).transient());
container.register('updateComposition', asClass(UpdateComposition).transient());
container.register('addRightHolderToComposition', asClass(AddRightHolderToComposition).transient());
container.register('addOwnerToComposition', asClass(AddOwnerToComposition).transient());
container.register('addRecordingToComposition', asClass(AddRecordingToComposition).transient());
container.register('getCompositionRecordings', asClass(GetCompositionRecordings).transient());
container.register('removeRightHolderFromComposition', asClass(RemoveRightHolderFromComposition).transient());
container.register('removeOwnerFromComposition', asClass(RemoveOwnerFromComposition).transient());
container.register('removeRecordingFromComposition', asClass(RemoveRecordingFromComposition).transient());

container.register('getAllConsumers', asClass(GetAllConsumers).transient());
container.register('getConsumer', asClass(GetConsumer).transient());

container.register(
  'getAllUsagesFromRightHolder',
  asClass(GetAllUsagesFromRightHolder).transient(),
);
container.register(
  'getAllUsagesFromRightHolderOrderedByTerritory',
  asClass(GetAllUsagesFromRightHolderOrderedByTerritory).transient(),
);
container.register(
  'getAllUsagesFromComposition',
  asClass(GetAllUsagesFromComposition).transient(),
);

// =============================================================================
// Repositories
// =============================================================================
container.register('userRepository', asClass(UserRepository).singleton());
container.register('catalogRepository', asClass(CatalogRepository).singleton());
container.register('compositionRepository', asClass(CompositionRepository).singleton());
container.register('recordingRepository', asClass(RecordingRepository).singleton());
container.register('ownershipShareRepository', asClass(OwnershipShareRepository).singleton());
container.register('collectionShareRepository', asClass(CollectionShareRepository).singleton());
container.register('consumerRepository', asClass(ConsumerRepository).singleton());
container.register('usageRepository', asClass(UsageRepository).singleton());

container.register('config', asClass(config).singleton());

// =============================================================================
// Infrastructure
// =============================================================================
container.register('logger', asFunction(logger).singleton());
container.register('sequelize', asValue(database));
container.register('UserModel', asValue(UserModel));
container.register('CatalogModel', asValue(CatalogModel));
container.register('CatalogCompositionModel', asValue(CatalogCompositionModel));
container.register('CompositionModel', asValue(CompositionModel));
container.register('RecordingModel', asValue(RecordingModel));
container.register('OwnershipShareModel', asValue(OwnershipShareModel));
container.register('CollectionShareModel', asValue(CollectionShareModel));
container.register('TerritoryModel', asValue(TerritoryModel));
container.register('ConsumerModel', asValue(ConsumerModel));
container.register('UsageModel', asValue(UsageModel));

// container.register('UserDAO', asValue(UserDAO));


// =============================================================================
// Interfaces
// =============================================================================
container.register('server', asClass(Express).singleton());
container.register('containerMiddleware', asValue(containerMiddleware(container)));

module.exports = container;
