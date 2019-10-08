export const minItems = (json, params) => {
  json.minItems = Number(params[0])
  return json
}
