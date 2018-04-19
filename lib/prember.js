'use strict';

module.exports = function urlsForPrember(/*tree*/) {
  let { prember } = this.hydeConfig();

  if (!prember) {
    return [];
  }

  return prember.reduce((urls, builder) => {
    let hyde = this.hydes.find((hyde) => hyde.name === builder.name);

    return hyde !== undefined ?
      urls.concat(urlsForHydeInstance(hyde, builder)) :
      urls;
  }, []);
}

function urlsForHydeInstance(hyde, builder) {
  let urls = [];

  let prefix = builder.prefix;
  let itemPrefix = builder.itemPrefix;
  let collectionPrefix = builder.collectionPrefix;

  for (let item of hyde.items) {
    urls.push(`${prefix}${itemPrefix}${id}`);
  }

  for (let collection of hyde.collections) {
    if (id !== hyde.name) {
      urls.push(`${prefix}${collectionPrefix}${id}`);
    }
  }

  return urls;
}
