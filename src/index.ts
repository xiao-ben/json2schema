import { parse } from './parser'
import generateJsonSchema from './jsonSchemaGenerator'

const json2Schema = (json: string) => {
  try {
    return generateJsonSchema(parse(json))
  } catch (err) {
    return {
      err: err.message
    }
  }
}

console.log(json2Schema(`{
  "a": "a"
}`))

export default json2Schema
