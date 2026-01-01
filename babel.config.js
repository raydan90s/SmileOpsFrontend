module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            '@context': './src/context',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@models': './src/types',
            '@constants': './src/constants',
            '@data': './src/data',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};