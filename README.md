![npm](https://img.shields.io/npm/v/@zhangbenfang/json2schema?color=0&logo=0)

# 基于带有注释的 JSON，生成用于校验 JSON 数据的 SCHEMA

## [josn schema 规则](https://json-schema.org/understanding-json-schema/reference/type.html)

## 规则

1. 注释符合标准的 json5 注释
2. 注释中以 @ 开头的字段，均被视作「指令」，指令名应符合 JS 的函数命名规则，指令名后括号内的内容被视为指令的参数，其个数不限。
非 @ 开头的注释内容，均被视作属性的描述
3. 当注释存在多行时，应将其合并视作一个属性的注释进行解析。

## 例子

``` js
{
  "age": 25, // 年龄 @min(0) @type(integer)
}
```

1. string 类型  
minLength(2)  
maxLength(8)  
format() 此指令的参数参考 JsonSchema 官网中的 format 规则  
pattern() 参数为自定义的正则匹配规则  
dateTime 无参数 正确的时间格式 如：2018-11-13T20:20:39+00:00  
2. number 类型  
minimum(0)  
maximum(2)  
multipleOf(10)  10 的整数倍  
integer 类型是整数  

3. object 类型
maxProperties(10)  
minProperties(3)  
optional  默认对象中所有的属性都是必须的，添加 optional 后为非必须属性  
array 类型  
maxItems(10)  
minItems(2)  
uniqueItems

4. 其他指令  
type 无需自己填写 如果是可变的 type 举例 @type(string, null)  
enum(live, album, instabook)  枚举  
timeStamp 时间戳
