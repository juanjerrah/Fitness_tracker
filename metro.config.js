const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);
config.resolver.sourceExts.push('sql');
const expoMetroRoot = path.dirname(require.resolve('@expo/metro/package.json'));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@expo/metro/')) {
    return {
      filePath: require.resolve(moduleName, { paths: [expoMetroRoot] }),
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
