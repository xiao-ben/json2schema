export const paging = (json, params) => {
  json.properties = {
    next: {
      type: ['string', 'null'],
      pattern: 'https?:/{2}[^s]*'
    },
    previous: {
      type: ['string', 'null'],
      pattern: 'https?:/{2}[^s]*'
    },
    is_end: {
      type: 'boolean'
    },
    is_first: {
      type: 'boolean'
    },
    limit: {
      type: 'integer'
    },
    offset: {
      type: 'integer'
    },
    total: {
      type: 'integer'
    }
  }

  return json
}
