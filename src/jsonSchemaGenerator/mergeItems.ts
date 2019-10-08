import { mergeWith, uniq, difference } from 'lodash'

export const mergeItems = items => {
  if (whetherMerger(items)) {
    const allProperties = getAllProperties(items)
    const finalItems = {
      properties: getMergedProperties(items, allProperties),
      type: 'object',
      required: getAllRequiredProperties(items, allProperties)
    }
    return finalItems
  } else {
    return { anyOf: items }
  }
}

// 当数组里全部都是对象时，才合并
const whetherMerger = items => {
  return !items.find(i => i.type !== 'object')
}

// 获取所有 item 中包含的属性
const getAllProperties = items =>
  items.reduce((a, b) => {
    return uniq([...a, ...Object.keys(b.properties)])
  }, [])

const getAllRequiredProperties = (items, allProperties) => {
  const optional = items.reduce((a, b) => {
    return uniq([...a, ...difference(Object.keys(b.properties), b.required)])
  }, [])
  return difference(allProperties, optional)
}

// 将多个 item 的 properties 合并
const getMergedProperties = (items, allProperties) =>
  allProperties.reduce((a, property) => {
    a[property] = {
      ...mergePropertySchema(items, property),
      type: getTypes(items, property)
    }
    return a
  }, {})

// merge 已有的属性 schema
const mergePropertySchema = (items, property) => {
  return items.reduce(
    (result, item) =>
      mergeWith(result, item.properties[property], customMergeRule),
    {}
  )
}

// 对 required 和 type 定义特殊的 merge 规则
const customMergeRule = (objValue, sourceValue, key, _, obj) => {
  if (key === 'required') {
    let required = sourceValue
    if (Array.isArray(objValue)) {
      const optional = difference(Object.keys(obj.properties), sourceValue)
      required = difference(objValue, optional)
    }
    return required
  } else if (
    key === 'type' &&
    (typeof objValue === 'string' || Array.isArray(objValue))
  ) {
    return uniq([].concat(objValue).concat(sourceValue))
  }
}

const getTypes = (items: Array<any>, property: string) =>
  uniq(
    items.reduce((types: Array<string>, item) => {
      const currentProperty = item.properties[property]
      if (currentProperty) {
        const currentTypes: Array<string> | string = currentProperty.type
        return types.concat(currentTypes)
      }
      return types
    }, [])
  )
