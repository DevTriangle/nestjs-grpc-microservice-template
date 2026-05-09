import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed'
import globals from 'globals'
import tseslint, { parser } from 'typescript-eslint'
import eslint from '@eslint/js'
import sonarjs from 'eslint-plugin-sonarjs'

export default tseslint.config(
  {
    ignores: ['dist/**/*.ts', 'dist/**', 'src/proto/types/**', '**/*.mjs', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  sonarjs.configs.recommended,
  eslintNestJs.configs.flatRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@darraghor/nestjs-typed/api-property-matches-property-optionality': 'off',

      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'sonarjs/todo-tag': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/concise-regex': 'off',
      'sonarjs/cognitive-complexity': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/only-throw-error': 'off',

      '@typescript-eslint/explicit-function-return-type': 'error',
      '@darraghor/nestjs-typed/controllers-should-supply-api-tags': 'off', // microservices without swagger
    },
  },
)
