const common = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9090
}

module.exports = Object.assign(common, require(`./environment/${common.env}`))
