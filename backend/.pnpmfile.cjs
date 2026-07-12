module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'better-sqlite3' || pkg.name === 'esbuild') {
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.install = 'node-gyp rebuild || true';
      }
      return pkg;
    },
  },
};
