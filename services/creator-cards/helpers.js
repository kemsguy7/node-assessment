const { randomBytes } = require('@app-core/randomness');

const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789';

function isAlphanumeric(value, length) {
  if (typeof value !== 'string' || value.length !== length) {
    return false;
  }

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (!ALPHANUMERIC.includes(char)) {
      return false;
    }
  }

  return true;
}

function isValidSlug(slug) {
  for (let i = 0; i < slug.length; i += 1) {
    const char = slug[i];
    const isLetter =
      (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    const isDigit = char >= '0' && char <= '9';
    const isAllowed = char === '-' || char === '_';

    if (!isLetter && !isDigit && !isAllowed) {
      return false;
    }
  }

  return true;
}

function isValidUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

function replaceWhitespaceWithHyphens(value) {
  let result = '';
  let lastWasSpace = false;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    const isWhitespace = char === ' ' || char === '\t' || char === '\n' || char === '\r';

    if (isWhitespace) {
      if (result.length > 0 && !lastWasSpace) {
        result += '-';
        lastWasSpace = true;
      }
    } else {
      result += char;
      lastWasSpace = false;
    }
  }

  return result;
}

function slugFromTitle(title) {
  let slug = title.toLowerCase();
  slug = replaceWhitespaceWithHyphens(slug);

  let cleaned = '';
  for (let i = 0; i < slug.length; i += 1) {
    const char = slug[i];
    const isLetter = char >= 'a' && char <= 'z';
    const isDigit = char >= '0' && char <= '9';
    const isAllowed = char === '-' || char === '_';

    if (isLetter || isDigit || isAllowed) {
      cleaned += char;
    }
  }

  return cleaned;
}

function randomAlphanumeric(length) {
  let result = '';
  const bytes = randomBytes(length * 2);

  for (let i = 0; i < length; i += 1) {
    const index = bytes.charCodeAt(i) % ALPHANUMERIC.length;
    result += ALPHANUMERIC[index];
  }

  return result;
}

function serializeCreatorCard(card, options = {}) {
  const { includeAccessCode = false } = options;

  const response = {
    id: card._id,
    title: card.title,
    description: card.description,
    slug: card.slug,
    creator_reference: card.creator_reference,
    links: card.links || [],
    service_rates: card.service_rates || null,
    status: card.status,
    access_type: card.access_type,
    created: card.created,
    updated: card.updated,
    deleted: card.deleted,
  };

  if (includeAccessCode) {
    response.access_code = card.access_code || null;
  }

  return response;
}

module.exports = {
  isAlphanumeric,
  isValidSlug,
  isValidUrl,
  slugFromTitle,
  randomAlphanumeric,
  serializeCreatorCard,
};
