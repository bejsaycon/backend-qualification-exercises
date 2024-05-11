import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}
  private cache = new Map<string, TOutput>()

  async actual_fire(key: string, ...args: TInputs): Promise<TOutput> {
    const release = await mutex.acquire();
    try {
      const cacheKey = JSON.stringify(key + args as string);
      const exists = this.cache.has(cacheKey);
      if (exists) {
        return this.cache.get(cacheKey)!;
      }
      const result = await this.handler(...args);
      this.cache.set(cacheKey, result);
      return result;
      
    } finally {
      release();
    }
  }

  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    
    return await this.actual_fire(key, ...args)
  }
}


