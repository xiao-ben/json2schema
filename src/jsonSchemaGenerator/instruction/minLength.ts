export const minLength = (json, params) => {
  json.minLength = Number(params[0])
  return json
}
