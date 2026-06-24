const { throwAppError } = require('@app-core/errors');
const CreatorCardMessages = require('@app/messages/creator-card');
const CreatorCardRepo = require('@app/repository/creator-card');
const { serializeCreatorCard } = require('./helpers');

async function getCreatorCard(serviceData) {
  let response;

  const { slug, access_code: accessCode } = serviceData;

  const card = await CreatorCardRepo.findOne({
    query: { slug, deleted: null },
  });

  if (!card) {
    throwAppError(CreatorCardMessages.NOT_FOUND, 'NF01');
  }

  if (card.status === 'draft') {
    throwAppError(CreatorCardMessages.DRAFT_NOT_FOUND, 'NF02');
  }

  if (card.access_type === 'private' && !accessCode) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED_VIEW, 'AC03');
  }

  if (card.access_type === 'private' && accessCode !== card.access_code) {
    throwAppError(CreatorCardMessages.INVALID_ACCESS_CODE, 'AC04');
  }

  response = serializeCreatorCard(card);

  return response;
}

module.exports = getCreatorCard;
