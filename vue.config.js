// vue.config.js
module.exports = {
    devServer: {
        host: '10.10.13.43',
        port: 8080,
        disableHostCheck: true,
        public: '10.10.13.43:8080'
    },
    runtimeCompiler: true
}
