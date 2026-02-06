import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "**/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      "no-redeclare": "off",
      "react/require-default-props": "off",
      "no-undef": "off",
      "class-methods-use-this": "off",
      "no-continue": "off",
      "no-restricted-syntax": "off",
      "no-plusplus": "off",
      "no-use-before-define": "off",
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": ["error"],
      "@typescript-eslint/no-use-before-define": ["error"],
      "no-unused-vars": "off",
      "no-underscore-dangle": "off",
      "no-dupe-class-members": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": ["error"],
      "lines-between-class-members": "off",
      "no-useless-return": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-unresolved": ["off"],
      "import/prefer-default-export": ["off"],
      "import/no-cycle": ["off"],
      "import/export": 0,
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      quotes: [
        2,
        "single",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      "prettier/prettier": [
        "warn",
        {
          trailingComma: "es5",
          singleQuote: true,
        },
      ],
      "import/no-extraneous-dependencies": ["off"],
      "react/jsx-props-no-spreading": 0,
      "react/function-component-definition": [
        2,
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "no-nested-ternary": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            "{}": false,
          },
        },
      ],
    },
  },
  prettier,
);
