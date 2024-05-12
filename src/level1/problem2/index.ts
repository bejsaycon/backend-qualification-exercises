import * as crypto from "crypto";

let randomByte: Buffer = crypto.randomBytes(4);
let counterByte: Buffer = crypto.randomBytes(3);
let count: number = parseInt(counterByte.toString("hex"), 16);

export class ObjectId {
  private data: Buffer;

  constructor(type: number, timestamp: number) {
    const typeByte = Buffer.alloc(1);
    typeByte.writeUInt8(type, 0);

    const timestampByte = Buffer.alloc(6);
    for (let i = 5; i >= 0; i--) {
      timestampByte.writeUInt8((timestamp >> (i * 8)) & 0xff, i);
    }

    this.data = Buffer.concat([
      typeByte,
      timestampByte,
      randomByte,
      counterByte,
    ]);

    count += 1;
    counterByte = Buffer.from([
      (count >> 16) & 0xff,
      (count >> 8) & 0xff,
      count,
    ]);
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: "hex" | "base64"): string {
    return this.data.toString(encoding ?? "hex");
  }
}