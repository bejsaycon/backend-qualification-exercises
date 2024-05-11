export type Value = string | number | boolean | null | undefined |
  Date | Buffer | Map<unknown, unknown> | Set<unknown> |
  Array<Value> | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  /**
   * insert your code here
   */
  if (value === null) {
    return null;
  } else if (typeof value !== 'object') {
    return value;
  } else if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  } else if (Buffer.isBuffer(value)) {
    return {
      __t: 'Buffer',
      __v: Array.from(value),
    };
  } else if (value instanceof Set) {
    return { __t: 'Set', __v: Array.from(value).map(serialize) };
  } else if (value instanceof Map) {
    const serializedMap: any[] = [];
    value.forEach((val:Value, key:Value) => {
        serializedMap.push([serialize(key), serialize(val)]);
    });
    return {
      __t: 'Map',
      __v: serializedMap
    };
  } else if (Array.isArray(value)) {
    return value.map(serialize);
  } else {
    const newObj: any = {};
    for (const key in value) {
        newObj[key] = serialize(value[key]);
    }
    return newObj;
  }
}



/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  /**
   * insert your code here
   */
  if (value === null || typeof value !== 'object') {
    return value as T;
  } else if (Array.isArray(value)) {
    return value.map(deserialize) as T;
  } else {
    const keys = Object.keys(value);
      if (keys.length === 2 && '__t' in value && '__v' in value) {
          if (value['__t'] === 'Date') {
              return new Date(value['__v'] as number) as T;
          } else if (value['__t'] === 'Buffer') {
              return Buffer.from(value['__v'] as string) as T;
          } else if (value['__t'] === 'Set') {
              const _val = value['__v'] as any
              return new Set(_val.map(deserialize)) as T;
          } else if (value['__t'] === 'Map') {
              const _val = value['__v'] as any
              const map = new Map();
              for (const [key, val] of _val) {
                  map.set(deserialize(key), deserialize(val));
              }
              return map as T;
          }
    } else {
        const newObj: any = {};
        for (const key in value) {
            newObj[key] = deserialize(value[key]);
        }
        return newObj;
    }
}
};