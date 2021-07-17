const {injectBabelPlugin, getLoader} = require('react-app-rewired');
const fileLoaderMatcher = function (rule) {
  return rule.loader && rule.loader.indexOf(`file-loader`) != -1;
}
module.exports = function override(config, env) {
  // babel-plugin-import
  config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: true,  }], config);
  config.module.rules[1].oneOf.unshift( {
    test: /\.less$/,
    use: [
      require.resolve('style-loader'),
      require.resolve('css-loader'),
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9',  ],
              flexbox: 'no-2009', }),
          ],
        },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          modifyVars: {
            "@brand-primary": "#7ECBFA",
            "@brand-primary-tap": "#37B2FA",
          },
        },
      },
]
} );
config.module.rules[1].oneOf.unshift( {
  test: /\.css$/,
  exclude: /node_modules|antd-mobile\.css/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: true,
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]'
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({ browsers: [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9', ],
            flexbox: 'no-2009',
          }),
        ],
      }, },
    ]
  } );
  let l = getLoader(config.module.rules, fileLoaderMatcher);
  l.exclude.push(/\.less$/);
  return config;
};
