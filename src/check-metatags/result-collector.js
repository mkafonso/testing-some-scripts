import { Transform } from "stream";

export function resultCollector() {
  const results = [];

  const collectResults = new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      results.push(JSON.parse(chunk.toString()));
      callback(null, chunk);
    },
  });

  return { results, collectResults };
}
