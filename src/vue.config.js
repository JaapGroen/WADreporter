// vue.config.js
module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        public: 'localhost:8080'
    },
    runtimeCompiler: true
}
