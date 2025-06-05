import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed'
import globals from 'globals'
import tseslint, { parser } from 'typescript-eslint'
import eslint from '@eslint/js'
import sonarjs from 'eslint-plugin-sonarjs'

export default tseslint.config(
  {
    ignores: ['dist/**/*.ts', 'dist/**', '**/*.mjs', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
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
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'off',
      '@darraghor/nestjs-typed/api-property-matches-property-optionality': 'off',
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',

      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  sonarjs.configs.recommended,
  eslintNestJs.configs.flatRecommended,
)
