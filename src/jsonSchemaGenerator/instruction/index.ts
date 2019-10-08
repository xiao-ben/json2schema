import { minLength } from './minLength'
import { maxLength } from './maxLength'
import { type } from './type'
import { format } from './format'
import { enumFun } from './enum'
import { maxItems } from './maxItems'
import { minItems } from './minItems'
import { uniqueItems } from './uniqueItems'
import { minProperties } from './minProperties'
import { maxProperties } from './maxProperties'
import { dateTime } from './dateTime'
import { integer } from './integer'
import { multipleOf } from './multipleOf'
import { pattern } from './pattern'
import { timeStamp } from './timeStamp'
import { minimum } from './minimum'
import { maximum } from './maximum'
import { paging } from './paging'

const instructionMap: { [key: string]: Function } = {
  minLength,
  maxLength,
  format,
  dateTime,
  pattern,
  minimum,
  maximum,
  multipleOf,
  maxItems,
  minItems,
  uniqueItems,
  maxProperties,
  minProperties,
  type,
  enum: enumFun,
  integer,
  timeStamp,
  paging
}

export default instructionMap
