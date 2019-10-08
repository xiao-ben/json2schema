export const maxProperties = (json, params) => {
  json.maxProperties = Number(params[0])
  return json
}
