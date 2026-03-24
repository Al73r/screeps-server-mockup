const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            'comma-dangle': ['error', {
                arrays: 'only-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'only-multiline',
            }],
            'lines-between-class-members': 'off',
            indent: 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'func-names': 'off',
            'key-spacing': 'off',
            'no-await-in-loop': 'off',
            'no-underscore-dangle': 'off',
            'object-curly-newline': 'off',
            'object-property-newline': 'off',
            'class-methods-use-this': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'linebreak-style': 'off',
        },
    },
    {
        files: ['test/**/*.ts'],
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'prefer-arrow-callback': 'off',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    }
);
