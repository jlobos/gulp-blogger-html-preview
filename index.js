const through = require('through2')
const blogger = require('blogger-html-preview')
const gutil = require('gulp-util')

const PluginError = gutil.PluginError
const PLUGIN_NAME = 'gulp-blogger-html-preview'

module.exports = ({url, token, withWidgets = true}) => {
  if (!url) {
    throw new PluginError(PLUGIN_NAME, 'Missing url')
  }
  if (!token) {
    throw new PluginError(PLUGIN_NAME, 'Missing token')
  }

  return through.obj(async (file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file)
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }

    try {
      const compiled = await blogger({
        url,
        token,
        templateText: String(file.contents),
        withWidgets
      })

      file.contents = Buffer.from(compiled)
      callback(null, file)
    } catch (err) {
      callback(new PluginError(PLUGIN_NAME, err))
    }
  })
}
