import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import storybook from "eslint-plugin-storybook";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  perfectionist.configs["recommended-alphabetical"],
  eslintConfigPrettier,
  {
    plugins: {
      "jsx-a11y": jsxA11y,
      "unused-imports": unusedImports,
    },
    rules: {
      "@next/next/no-page-custom-font": "off",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": "error",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "unused-imports/no-unused-imports": "error",
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img", "object", "area", "input[type=\"image\"]"],
          img: ["Image"],
          object: ["Object"],
          area: ["Area"],
          "input[type=\"image\"]": ["InputImage"],
        },
      ],
      "jsx-a11y/media-has-caption": [
        "error",
        { audio: ["Audio"], video: ["Video"], track: ["Track"] },
      ],
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],
      "jsx-a11y/interactive-supports-focus": [
        "error",
        {
          tabbable: [
            "button",
            "checkbox",
            "link",
            "searchbox",
            "spinbutton",
            "switch",
            "textbox",
          ],
        },
      ],
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/aria-role": ["error", { ignoreNonDOM: true }],
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          labelComponents: ["Label"],
          labelAttributes: ["label"],
          controlComponents: ["Input", "Select", "Textarea"],
          depth: 3,
        },
      ],
      "jsx-a11y/autocomplete-valid": ["error", { inputComponents: ["Input"] }],
      "jsx-a11y/heading-has-content": ["error", { components: ["Heading"] }],
      "jsx-a11y/no-aria-hidden-on-focusable": "error",
      "jsx-a11y/tabindex-no-positive": "error",
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel"] },
      ],
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link", "TextLink"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/anchor-has-content": [
        "error",
        { components: ["Link", "TextLink"] },
      ],
    },
    settings: {
      "import/resolver": { typescript: {} },
    },
  },
  {
    languageOptions: { parserOptions: { project: true } },
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
    },
  },
  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
