import baseConfig from '@interstardev/eslint-config/typescript';

const tsConfig = baseConfig.find(
  (config) => config.name === '@interstardev/eslint-config/typescript',
);

if (tsConfig && tsConfig.rules) {
  tsConfig.rules['@typescript-eslint/no-unsafe-member-access'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-explicit-any'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-unsafe-return'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-unsafe-assignment'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-unsafe-call'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-unsafe-argument'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-misused-promises'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-unsafe-enum-comparison'] = 'warn';
  tsConfig.rules['@typescript-eslint/restrict-template-expressions'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-base-to-string'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-empty-object-type'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-namespace'] = 'warn';
  tsConfig.rules['@typescript-eslint/unbound-method'] = 'warn';
  tsConfig.rules['@typescript-eslint/no-redundant-type-constituents'] = 'warn';

  tsConfig.rules['@typescript-eslint/only-throw-error'] = 'off';
  tsConfig.rules['@typescript-eslint/no-unused-vars'] = [
    'warn',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ];
}

export default [
  {
    ignores: ['dist/**/*', 'build/**/*', 'node_modules/**/*', 'coverage/**/*'],
  },
  ...baseConfig,
];
