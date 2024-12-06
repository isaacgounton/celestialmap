import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.celestialmap',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    discardUncaughtJsExceptions: true
  },
  webpackConfigPath: 'webpack.config.js'
} as NativeScriptConfig;