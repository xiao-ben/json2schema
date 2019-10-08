export const maxLength = (json, params) => {
  json.maxLength = Number(params[0])
  return json
}
