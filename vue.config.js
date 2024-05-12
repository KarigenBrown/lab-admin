const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 7070,
        proxy:'http://localhost:8081'
    },
    publicPath: './',
    assetsDir: 'static/',
    chainWebpack: config => {
        config.plugin('html')
            .tap(args => {
                args[0].title = '实验室管理系统';
                return args;
            })
    }
})
