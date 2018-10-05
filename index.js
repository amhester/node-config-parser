/**
 * @typedef {Object} Definition
 * @property {Any} default The value to be returned when no environment variable is set for the property.
 * @property {String} type The expected data type for the property. Raw value will be converted if possible.
 */

const TYPES = {
  ARRAY: 'array',
  OBJECT: 'object',
  NUMBER: 'number',
  STRING: 'string',
  BOOL: 'bool'
}

/**
  * @function parseNumberDef
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {Number} Returns the raw value parsed as a number if possible. If raw is falsy, will return default configuration.
  */
function parseNumberDef(raw, def) {
  const _default = def.default || 0
  if (!raw) {
    return _default
  }
  return parseInt(raw, 10) || _default
}

/**
  * @function parseStringDef
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {String} Returns the raw value. If raw is falsy, will return default configuration.
  */
function parseStringDef(raw, def) {
  if (!raw) {
    return def.default || ''
  }
  return raw
}

/**
  * @function parseBoolDef
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {Boolean} Returns the result of raw being coerced to true or false. If raw is falsy, will return default configuration.
  */
function parseBoolDef(raw, def) {
  if (!raw) {
    return def.default || false
  }
  if (raw.toLowerCase() === 'true' || raw === '1') {
    return true
  }
  return false
}

/**
  * @function parseArrayDef
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {Array} Returns an Array of strings as the result of splitting raw on commas. If raw is falsy, will return default configuration.
  */
function parseArrayDef(raw, def) {
  if (!raw || typeof raw !== 'string') {
    return def.default || []
  }
  return raw.split(',')
}

/**
  * @function parseObjectDef
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {Object} Returns an Object as the result of parsing raw as json. If raw is falsy, will return default configuration.
  */
function parseObjectDef(raw, def) {
  if (!raw || typeof raw !== 'string') {
    return def.default || {}
  }
  let rawObj = {}
  try {
    rawObj = JSON.parse(raw)
  } catch (e) {
    return rawObj
  }
  return rawObj
}

/**
  * @function parseRawValue
  * @param {String} raw The raw value from the environment.
  * @param {Definition} def The properties configured definition.
  * @returns {Any} Returns the result of the configured type parsing.
  */
function parseRawValue(raw, def) {
  switch (def.type) {
    case TYPES.NUMBER:
      return parseNumberDef(raw, def)
    case TYPES.STRING:
      return parseStringDef(raw, def)
    case TYPES.BOOL:
      return parseBoolDef(raw, def)
    case TYPES.ARRAY:
      return parseArrayDef(raw, def)
    case TYPES.OBJECT:
      return parseObjectDef(raw, def)
    default:
      return raw
  }
}

/**
 * @function parseConfig Parses the given config object, hydrating with values from the environment and coercing into the defined types.
 * @param {Object} config The config object to parse.
 */
function parseConfig(config) {
  const parsedConfig = {}
  Object.keys(config)
    .forEach((key) => {
      const def = config[key]
      const raw = process.env[key]
      parsedConfig[key] = parseRawValue(raw, def)
    })
  return parsedConfig
}

module.exports = {
  parseNumberDef,
  parseStringDef,
  parseBoolDef,
  parseArrayDef,
  parseObjectDef,
  parseRawValue,
  parseConfig,
  TYPES
}
