const {
  parseConfig,
  parseRawValue,
  parseNumberDef,
  parseStringDef,
  parseBoolDef,
  parseArrayDef,
  parseObjectDef,
  TYPES
} = require('./index')

/* eslint-disable no-undef */
describe('Module Config', () => {
  describe('#parseStringDef', () => {
    it('Should return empty string when raw is falsy and def.default is falsy', () => {
      const result = parseStringDef(undefined, {})
      expect(result).toBe('')
    })

    it('Should return def.default when raw is falsy and def.default is truthy', () => {
      const result = parseStringDef(undefined, { default: 'test' })
      expect(result).toBe('test')
    })

    it('Should return raw when raw is truthy', () => {
      const result = parseStringDef('test', { default: 'test2' })
      expect(result).toBe('test')
    })
  })

  describe('#parseNumberDef', () => {
    it('Should return a Number when raw value is a valid Number', () => {
      const result = parseNumberDef('1', { default: 0 })
      expect(result).toBe(1)
    })

    it('Should return def.default when raw is not a valid number and def.default is truthy', () => {
      const result = parseNumberDef('test', { default: 1 })
      expect(result).toBe(1)
    })

    it('Should return 0 when raw is not a valid number and default is falsy', () => {
      const result = parseNumberDef('test', {})
      expect(result).toBe(0)
    })

    it('Should return 0 when raw is falsey and def.default is falsy', () => {
      const result = parseNumberDef(undefined, {})
      expect(result).toBe(0)
    })

    it('Should return def.default value when raw is falsey and def.default is truthy', () => {
      const result = parseNumberDef(undefined, { default: 1 })
      expect(result).toBe(1)
    })
  })

  describe('#parseBoolDef', () => {
    it('Should return true when raw is "true"', () => {
      const result = parseBoolDef('true', { default: false })
      expect(result).toBe(true)
    })

    it('Should return true when raw is "True"', () => {
      const result = parseBoolDef('True', { default: false })
      expect(result).toBe(true)
    })

    it('Should return true when raw is "TRUE"', () => {
      const result = parseBoolDef('TRUE', { default: false })
      expect(result).toBe(true)
    })

    it('Should return true when raw is "1"', () => {
      const result = parseBoolDef('1', { default: false })
      expect(result).toBe(true)
    })

    it('Should return false when raw is truthy and not a true value', () => {
      const result = parseBoolDef('test', { default: true })
      expect(result).toBe(false)
    })

    it('Should return false when raw is falsey and def.default is falsy', () => {
      const result = parseBoolDef(undefined, {})
      expect(result).toBe(false)
    })

    it('Should return def.default when raw is falsey and def.default is truthy', () => {
      const result = parseBoolDef(undefined, { default: true })
      expect(result).toBe(true)
    })
  })

  describe('#parseArrayDef', () => {
    it('Should return ["one","two","three"] when raw is "one,two,three"', () => {
      const result = parseArrayDef('one,two,three', { default: ['1'] })
      expect(result).toEqual(['one', 'two', 'three'])
    })

    it('Should return ["1","2","3"] when raw is "1,2,3"', () => {
      const result = parseArrayDef('1,2,3', { default: ['1'] })
      expect(result).toEqual(['1', '2', '3'])
    })

    it('Should return ["foo bar"] when raw is "foo bar"', () => {
      const result = parseArrayDef('foo bar', { default: ['1'] })
      expect(result).toEqual(['foo bar'])
    })

    it('Should return [] when raw is falsey and def.default is falsy', () => {
      const result = parseArrayDef(undefined, {})
      expect(result).toEqual([])
    })

    it('Should return def.default when raw is falsey and def.default is truthy', () => {
      const result = parseArrayDef(undefined, { default: ['1'] })
      expect(result).toEqual(['1'])
    })
  })

  describe('#parseObjectDef', () => {
    it('Should return { foo: "bar", count: 1, valid: true } when raw is "{"foo":"bar","count":1,"valid":true}"', () => {
      const result = parseObjectDef('{"foo":"bar","count":1,"valid":true}', { default: { default: true } })
      expect(result).toEqual({ foo: 'bar', count: 1, valid: true })
    })

    it('Should return { arr: [1], obj: { foo: "bar" } } when raw is "{"arr":[1],"obj":{"foo":"bar"}}"', () => {
      const result = parseObjectDef('{"arr":[1],"obj":{"foo":"bar"}}', { default: { default: true } })
      expect(result).toEqual({ arr: [1], obj: { foo: 'bar' } })
    })

    it('Should return {} when raw is "bad json"', () => {
      const result = parseObjectDef('bad json', { default: { default: true } })
      expect(result).toEqual({})
    })

    it('Should return {} when raw is falsey and def.default is falsy', () => {
      const result = parseObjectDef(undefined, {})
      expect(result).toEqual({})
    })

    it('Should return def.default when raw is falsy and def.default is truthy', () => {
      const result = parseObjectDef(undefined, { default: { default: true } })
      expect(result).toEqual({ default: true })
    })
  })

  describe('#parseRawValue', () => {
    it('Should return a parsed number when def.type is "number"', () => {
      const result = parseRawValue('1', { type: TYPES.NUMBER })
      expect(typeof result).toBe('number')
    })

    it('Should return a parsed string when def.type is "string"', () => {
      const result = parseRawValue('hello', { type: TYPES.STRING })
      expect(typeof result).toBe('string')
    })

    it('Should return a parsed bool when def.type is "bool"', () => {
      const result = parseRawValue('TRUE', { type: TYPES.BOOL })
      expect(typeof result).toBe('boolean')
    })

    it('Should return a parsed array when def.type is "array"', () => {
      const result = parseRawValue('1,2', { type: TYPES.ARRAY })
      expect(Array.isArray(result)).toBe(true)
    })

    it('Should return a parsed object when def.type is "object"', () => {
      const result = parseRawValue('{"foo": "bar"}', { type: TYPES.OBJECT })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('Should return the raw value when type is not recognized', () => {
      const result = parseRawValue('some blob', { type: 'blob' })
      expect(result).toBe('some blob')
    })
  })

  describe('#parseConfig', () => {
    let config = {}

    beforeEach(() => {
      config = {
        TEST_STRING: { default: 'default', type: TYPES.STRING },
        TEST_NUMBER: { default: -1, type: TYPES.NUMBER },
        TEST_BOOL: { default: false, type: TYPES.BOOL },
        TEST_ARRAY: { default: [], type: TYPES.ARRAY },
        TEST_OBJECT: { default: {}, type: TYPES.OBJECT }
      }

      process.env = {
        TEST_STRING: 'hello',
        TEST_NUMBER: '1',
        TEST_BOOL: 'true',
        TEST_ARRAY: '1,2',
        TEST_OBJECT: '{"foo": "bar"}'
      }
    })

    it('Should parse out the given config', () => {
      const result = parseConfig(config)
      expect(result).toEqual({
        TEST_STRING: 'hello',
        TEST_NUMBER: 1,
        TEST_BOOL: true,
        TEST_ARRAY: ['1', '2'],
        TEST_OBJECT: { foo: 'bar' }
      })
    })
  })
})
