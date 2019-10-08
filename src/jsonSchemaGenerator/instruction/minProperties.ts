export const minProperties = (json, params) => {
  json.minProperties = Number(params[0])
  return json
}
