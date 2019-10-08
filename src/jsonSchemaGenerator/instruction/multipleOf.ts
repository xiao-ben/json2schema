export const multipleOf = (json, params) => {
  json.multipleOf = Number(params[0])
  return json
}
