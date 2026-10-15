import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/node_modules/', 'artifacts/', 'example-app/ios/', 'example-app/index.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { sourceType: 'module' },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // House style: blank lines around returns and blocks, and always `return await`.
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-else-return': ['error', { allowElseIf: true }],
      '@typescript-eslint/return-await': ['error', 'always'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'throw' },
      ],
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    // The suite's layers use PascalCase files and folders (Pages/SignInPage.ts, Specs/NewAccount.spec.ts).
    files: ['e2e/**/*.ts', 'fake-backend/**/*.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.ts': 'PASCAL_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'e2e/**/': 'PASCAL_CASE' }],
    },
  },
  {
    files: ['e2e/Specs/**/*.ts', 'fake-backend/**/*.test.ts'],
    rules: {
      'no-await-in-loop': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  prettierRecommended,
);
