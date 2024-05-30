module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: [
      './dist/ng-tracker',
      './dist/nest-backend/main.js',
      './dist/nest-backend/package.json',
      './dist/nest-backend/package-lock.json',
      './dist/nest-backend/node_modules',
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
