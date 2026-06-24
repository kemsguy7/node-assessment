const validator = require('@app-core/validator');
const { throwAppError } = require('@app-core/errors');
const CreatorCardMessages = require('@app/messages/creator-card');
const CreatorCardRepo = require('@app/repository/creator-card');
const {
  isAlphanumeric,
  isValidSlug,
  isValidUrl,
  slugFromTitle,
  randomAlphanumeric,
  serializeCreatorCard,
} = require('./helpers');

const createSpec = `root {
  title string<trim|minLength:3|maxLength:100>
  description? string<trim|maxLength:500>
  slug? string<trim|lowercase|lengthBetween:5,50>
  creator_reference string<length:20>
  links[]? {
    title string<trim|minLength:1|maxLength:100>
    url string<trim|maxLength:200>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|minLength:3|maxLength:100>
      description string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string
}`;

const parsedCreateSpec = validator.parse(createSpec);

async function isSlugTaken(slug) {
  const existing = await CreatorCardRepo.findOne({ query: { slug } });
  return !!existing;
}

async function resolveSlug(title, providedSlug) {
  if (providedSlug) {
    if (!isValidSlug(providedSlug)) {
      throwAppError('slug contains invalid characters', 'VALIDATION_ERROR');
    }

    if (await isSlugTaken(providedSlug)) {
      throwAppError(CreatorCardMessages.SLUG_TAKEN, 'SL02');
    }

    return providedSlug;
  }

  let slug = slugFromTitle(title);

  if (slug.length < 5 || (await isSlugTaken(slug))) {
    slug = `${slug}-${randomAlphanumeric(6)}`;
  }

  while (await isSlugTaken(slug)) {
    slug = `${slug}-${randomAlphanumeric(6)}`;
  }

  return slug;
}

function validateAccessRules(data) {
  const accessType = data.access_type || 'public';

  if (accessType === 'private' && !data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_REQUIRED, 'AC01');
  }

  if (accessType === 'public' && data.access_code) {
    throwAppError(CreatorCardMessages.ACCESS_CODE_NOT_ALLOWED, 'AC05');
  }

  if (data.access_code && !isAlphanumeric(data.access_code, 6)) {
    throwAppError('access_code must be exactly 6 alphanumeric characters', 'VALIDATION_ERROR');
  }
}

function validateLinks(links) {
  if (!links || !links.length) {
    return;
  }

  links.forEach((link, index) => {
    if (!isValidUrl(link.url)) {
      throwAppError(`links[${index}].url must start with http:// or https://`, 'VALIDATION_ERROR');
    }
  });
}

function validateServiceRates(serviceRates) {
  if (!serviceRates) {
    return;
  }

  if (!serviceRates.rates || !serviceRates.rates.length) {
    throwAppError('service_rates.rates must be a non-empty array', 'VALIDATION_ERROR');
  }

  serviceRates.rates.forEach((rate, index) => {
    if (!Number.isInteger(rate.amount)) {
      throwAppError(`service_rates.rates[${index}].amount must be a positive integer`, 'VALIDATION_ERROR');
    }
  });
}

async function createCreatorCard(serviceData) {
  let response;

  const data = validator.validate(serviceData, parsedCreateSpec);
  const accessType = data.access_type || 'public';

  validateAccessRules({ ...data, access_type: accessType });
  validateLinks(data.links);
  validateServiceRates(data.service_rates);

  const slug = await resolveSlug(data.title, data.slug);

  const card = await CreatorCardRepo.create({
    title: data.title,
    description: data.description || null,
    slug,
    creator_reference: data.creator_reference,
    links: data.links || [],
    service_rates: data.service_rates || null,
    status: data.status,
    access_type: accessType,
    access_code: accessType === 'private' ? data.access_code : null,
    deleted: null,
  });

  response = serializeCreatorCard(card, { includeAccessCode: true });

  return response;
}

module.exports = createCreatorCard;
