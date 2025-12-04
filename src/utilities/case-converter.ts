import camelCase from 'lodash/camelCase.js';
import isArray from 'lodash/isArray.js';
import isPlainObject from 'lodash/isPlainObject.js';
import snakeCase from 'lodash/snakeCase.js';

export function camelCaseKeys(
  object: Array<Record<string, any>> | Record<string, any>,
): Array<Record<string, any>> | Record<string, any> {
  if (isArray(object))
    return object.map(item => camelCaseKeys(item));
  if (!isPlainObject(object))
    return object;
  const result: Record<string, any> = {};
  for (const key in object) {
    const newKey = camelCase(key);
    const value = object[key];
    if (isPlainObject(value)) {
      result[newKey] = camelCaseKeys(value);
    }
    else if (isArray(value)) {
      result[newKey] = value.map(item => camelCaseKeys(item));
    }
    else {
      result[newKey] = value;
    }
  }
  return result;
}

export function snakeCaseKeys(
  object: Array<Record<string, any>> | Record<string, any>,
): Array<Record<string, any>> | Record<string, any> {
  if (isArray(object))
    return object.map(item => snakeCaseKeys(item));
  if (!isPlainObject(object))
    return object;
  const result: Record<string, any> = {};
  for (const key in object) {
    const newKey = snakeCase(key);
    const value = object[key];
    if (isPlainObject(value)) {
      result[newKey] = snakeCaseKeys(value);
    }
    else if (isArray(value)) {
      result[newKey] = value.map(item => snakeCaseKeys(item));
    }
    else {
      result[newKey] = value;
    }
  }
  return result;
}
