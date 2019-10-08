export const type = (json, params) => {
  json.type = params.length === 1 ? params[0] : params
  return json
}
