export const maxItems = (json, params) => {
  json.maxItems = Number(params[0])
  return json
}
