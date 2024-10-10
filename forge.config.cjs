module.exports = {
  packagerConfig: {
    asar: true,
    ignore: [/^\/node_modules/, /^\/dist\/(?!nest-backend)/],
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
      platforms: ['darwin', 'linux', 'win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'WodenWang820118',
          name: 'nx-ng-nest-electron',
        },
        prerelease: true,
      },
    },
  ],
};
