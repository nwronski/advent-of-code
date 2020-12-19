require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [ 'plugin:nwronski/base' ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'import/no-extraneous-dependencies':'off',
    'import/order': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'complexity': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};
