'use strict';

module.exports = function registerPremberUrls(/*tree*/) {
  let config = this.hydeConfig();
  let hydes = this.hydeTrees.map((tree) => tree.hyde);

  return config.prember.reduce((urls, builder) => {
    let instance = hydes.find((instance) => instance.name === builder.name);

    return instance !== undefined ?
      urls.concat(urlsForHydeInstance(instance, builder)) :
      urls;
  }, []);
}

function urlsForHydeInstance(hyde, builder) {
  let urls = [];
  let startsWithHydeNameRegExp = new RegExp(`^${hyde.name}/`);

  let prefix = builder.prefix;
  let itemPrefix = builder.itemPrefix;
  let collectionPrefix = builder.collectionPrefix;

  for (let item of hyde.items) {
    let id = item.id.replace(startsWithHydeNameRegExp, '');

    urls.push(`${prefix}${itemPrefix}${id}`);
  }

  for (let collection of hyde.collections) {
    let id = collection.id.replace(startsWithHydeNameRegExp, '');

    if (id !== hyde.name) {
      urls.push(`${prefix}${collectionPrefix}${id}`);
    }
  }

  return urls;
}
