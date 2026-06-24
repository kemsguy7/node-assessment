const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const CreatorCardMessages = require('@app/messages/creator-card');
const CreatorCardRepo = require('@app/repository/creator-card');
const { serializeCreatorCard } = require('./helpers');

const deleteSpec = `root {
  slug string<trim|minLength:1>
  creator_reference string<length:20>
}`;

const parsedDeleteSpec = validator.parse(deleteSpec);

async function deleteCreatorCard(serviceData) {
  let response;

  const data = validator.validate(serviceData, parsedDeleteSpec);

  const card = await CreatorCardRepo.findOne({
    query: { slug: data.slug, deleted: null },
  });

  if (!card) {
    throwAppError(CreatorCardMessages.NOT_FOUND, 'NF01');
  }

  const deletedAt = Date.now();

  await CreatorCardRepo.updateOne({
    query: { slug: data.slug },
    updateValues: { deleted: deletedAt },
  });

  response = serializeCreatorCard(
    { ...card, deleted: deletedAt, updated: deletedAt },
    { includeAccessCode: true }
  );

  return response;
}

module.exports = deleteCreatorCard;
