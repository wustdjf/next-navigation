type DataType =
  | "Number"
  | "String"
  | "Boolean"
  | "Object"
  | "Function"
  | "Null"
  | "Undefined"
  | "Symbol"
  | "BigInt"
  | "Array"
  | "Date"
  | "RegExp";
/**
 * 通用且精确的类型判断
 * @param value 需要判断的值
 * @param expectedType 预期的类型
 * @returns 如果值符合预期类型则返回 true，否则返回 false
 */
export const isType = (value: unknown, expectedType: DataType) => {
  const GET_TYPE = Object.prototype.toString;

  const typeTag = `[object ${expectedType}]`;

  return GET_TYPE.call(value) === typeTag;
};

/**
 * 将 Promise 转换为 { error: D | null; res: T | undefined } 的元组形式
 * @param {Promise<T>} promise 需要转换的 Promise 对象
 * @returns Promise<{ error: D | null; res: T | undefined }>
 */
export function toPromise<T = undefined, D = Error>(
  promise: Promise<T>
): Promise<{ error: D | null; res: T | undefined }> {
  return promise
    .then<{ error: null; res: T }>((res: T) => ({ error: null, res }))
    .catch<{ error: D; res: undefined }>((err: D) => ({
      error: err,
      res: undefined,
    }));
}
