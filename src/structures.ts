export type Params = Array<string | number | boolean>

export type Instruction = {
  name: string
  params: Params
}

export type ValueDescriptor = {
  value?: Scope
  type?: string
  comment?: string
  example?: any
  instructions?: Array<Instruction>
}

export enum ScopeType {
  Object = 'object',
  Array = 'array'
}

export class Scope {
  properties: {
    [key: string]: ValueDescriptor
  } = {}
  items: Array<ValueDescriptor | Scope> = []
  type: ScopeType

  constructor(type: ScopeType) {
    this.type = type
  }

  set(name: string, descriptor: ValueDescriptor) {
    if (this.type === ScopeType.Object) {
      this.properties[name] = descriptor
    }
  }

  add(value: ValueDescriptor | Scope) {
    this.items.push(value)
  }
}
