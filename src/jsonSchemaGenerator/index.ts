import { Instruction, Scope, ValueDescriptor } from '../structures'
import instructions from './instruction'
import { mergeItems } from './mergeItems'
import { merge } from 'lodash'

const generateJsonSchema = (obj: Scope | ValueDescriptor) => {
  if (obj instanceof Scope) {
    return scopeToSchema(obj)
  } else {
    return valueDescriptorToSchema(obj)
  }
}

const scopeToSchema = (obj: Scope) => {
  let result: any = { type: obj.type }
  if (obj.type === 'array') {
    if (obj.items.length) {
      result.items = mergeItems(getItems(obj.items))
    }
  } else if (obj.type === 'object') {
    if (obj.properties) {
      result.properties = getProperties(obj.properties)
      result.required = getRequiredProperties(obj.properties)
    }
  }
  return result
}

const valueDescriptorToSchema = (obj: ValueDescriptor) => {
  let result: any = {}
  if (obj.type === 'array') {
    if (obj.value && obj.value.items.length) {
      result.items = mergeItems(getItems(obj.value.items))
    }
  } else if (obj.type === 'object') {
    if (obj.value && obj.value.properties) {
      result.properties = getProperties(obj.value.properties)
      result.required = getRequiredProperties(obj.value.properties)
    }
  }
  result = merge(result, instructionToSchema(obj))
  return result
}

const instructionToSchema = (obj: ValueDescriptor) => {
  const json: any = {
    type: obj.type
  }

  if (obj.comment) {
    json.comment = obj.comment
  }

  if (!obj.instructions || !obj.instructions.length) {
    return json
  }

  return obj.instructions.reduce(
    (accumulator: ValueDescriptor, currentValue: Instruction) => {
      const { name, params } = currentValue
      const instruction = getInstruction(name)
      if (instruction) {
        accumulator = instruction(accumulator, params)
      }

      return accumulator
    },
    json
  )
}

const getInstruction = (name: string) => {
  return instructions[name] || null
}

const getItems = (items: Array<any>) => {
  return items.map((item: Scope | ValueDescriptor) => generateJsonSchema(item))
}

const getProperties = (properties: any) => {
  let newResult: any = {}
  for (const key in properties) {
    newResult[key] = generateJsonSchema(properties[key])
  }
  return newResult
}

const getRequiredProperties = properties => {
  return Object.keys(properties).reduce(
    (accumulator: Array<string>, currentValue: string) => {
      if (
        !properties[currentValue].instructions.find(
          item => item.name === 'optional'
        )
      ) {
        accumulator.push(currentValue)
      }
      return accumulator
    },
    []
  )
}

export default generateJsonSchema
