module.exports = (dirname) => ({
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
  roots: require(dirname + '/tsconfig.json').references?.map(r => r.path),
  modulePathIgnorePatterns: [ '-', 'node_modules' ]
})
