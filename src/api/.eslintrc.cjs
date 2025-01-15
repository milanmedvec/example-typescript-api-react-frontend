module.exports = {
    "parserOptions": {
        "project": "./tsconfig.json",
        "extraFileExtensions": [".html"]
    },
    "ignorePatterns": ["**/*.html"],
    "settings": {
        "import/resolver": {
            "typescript": {
                "project": [
                    "./tsconfig.json"
                ]
            }
        }
    },
    "parser": "@typescript-eslint/parser",
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/extensions": [
            ".js",
            ".jsx"
        ],
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        }
    },
    "plugins": [
        "prettier",
        "react",
        "import",
        "@typescript-eslint",
        "github",
        "sonarjs",
        "functional"
    ],
    "extends": [
        "prettier",
        "plugin:prettier/recommended",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:github/recommended"
    ],
    "rules": {
        "prettier/prettier": [
            "error",
            {
                "arrowParens": "avoid",
                "bracketSpacing": true,
                "bracketSameLine": false,
                "printWidth": 120,
                "proseWrap": "preserve",
                "requirePragma": false,
                "semi": true,
                "singleQuote": true,
                "quoteProps": "preserve",
                "tabWidth": 4,
                "trailingComma": "all",
                "useTabs": false,
                "overrides": [
                    {
                        "files": "*.json",
                        "options": {
                            "printWidth": 200
                        }
                    }
                ]
            },
            {
                "usePrettierrc": false
            }
        ],
        "camelcase": "off",
        "i18n-text/no-en": "off",
        "import/no-cycle": ["error"],
        "prefer-const": ["error"],
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-param-reassign": ["error"],
        "no-return-await": "off",
        "no-invalid-this": "off",
        "react/prop-types": ["error", { "skipUndeclared": true }],
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/ban-types": "error",
        "@typescript-eslint/return-await": ["error", "in-try-catch"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/prefer-readonly": "off",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "warn",
        "@typescript-eslint/consistent-type-imports": "warn",
        "@typescript-eslint/method-signature-style": ["warn", "property"],
        "@typescript-eslint/no-invalid-this": "warn",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "vars": "all",
                "args": "after-used",
                "ignoreRestSiblings": true,
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }
        ],
        "quote-props": ["error", "consistent"],
        "filenames/match-regex": "off",
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index"
                ]
            }
        ],
        "import/no-unresolved": "off",
        "import/default": "off",
        "import/named": "off",
        "import/no-deprecated": "warn",
        "import/no-namespace": "off",
        "react/display-name": "off",
        "import/no-named-as-default-member": "off",
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": ["error", {}],
        "@typescript-eslint/explicit-module-boundary-types": [
            "error",
            {
                "allowArgumentsExplicitlyTypedAsAny": true,
                "allowDirectConstAssertionInArrowFunctions": true,
                "allowHigherOrderFunctions": true,
                "allowTypedFunctionExpressions": true
            }
        ],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/exhaustive-deps": [
            "warn",
            {
                "additionalHooks": "(useDrop|useDrag)"
            }
        ],
        "github/no-then": "off",
        "sonarjs/no-duplicate-string": "off",
        "sonarjs/prefer-single-boolean-return": "off",
        "sonarjs/no-small-switch": "off",
        "sonarjs/no-extra-arguments": "off",
        "sonarjs/cognitive-complexity": ["error", 25],
        "eslint-comments/no-use": "off",
        "eslint-comments/no-restricted-disable": "off",
        "import/extensions": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "warn",
        "import/no-anonymous-default-export": "off"
    }
};
