export default async function reconcile(sources: (() => Promise<Record<string, any>>)[]): Promise<Record<string, any>> {
  const results = await Promise.allSettled(sources.map(source => source()));
  const result: Record<string, any> = {};
  
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].status === 'fulfilled') {
      const data = (results[i] as PromiseFulfilledResult<Record<string, any>>).value;
      if (data && typeof data === 'object') {
        for (const key in data) {
          if (data.hasOwnProperty(key) && data[key] != null) {
            result[key] = data[key];
          }
        }
      }
    }
  }
  
  return result;
}