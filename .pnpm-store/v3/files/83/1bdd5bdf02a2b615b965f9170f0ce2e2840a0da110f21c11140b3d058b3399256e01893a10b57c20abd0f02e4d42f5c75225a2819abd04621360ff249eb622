// src/globs.ts
var GLOB_JS = "**/*.?([cm])js";
var GLOB_JSX = "**/*.?([cm])jsx";
var GLOB_TS = "**/*.?([cm])ts";
var GLOB_TSX = "**/*.?([cm])tsx";
var GLOB_VUE = "**/*.vue";
var GLOB_ASTRO = "**/*.astro";
var GLOB_NODE_MODULES = "**/node_modules";
var GLOB_DIST = "**/dist";
var GLOB_LOCKFILE = [
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/bun.lockb"
];
var GLOB_EXCLUDE = [
  GLOB_NODE_MODULES,
  GLOB_DIST,
  ...GLOB_LOCKFILE,
  "**/output",
  "**/coverage",
  "**/temp",
  "**/.temp",
  "**/tmp",
  "**/.tmp",
  "**/fixtures",
  "**/.vitepress/cache",
  "**/.nuxt",
  "**/.next",
  "**/.vercel",
  "**/.changeset",
  "**/.idea",
  "**/.cache",
  "**/.output",
  "**/.vite-inspect",
  "**/.nitro",
  "**/.vinxi",
  "**/.astro",
  "**/.yarn",
  "**/CHANGELOG*.md",
  "**/*.min.*",
  "**/LICENSE*",
  "**/__snapshots__",
  "**/auto-import?(s).d.ts",
  "**/components.d.ts"
];

// src/configs/ignores.ts
var ignores = [{ ignores: GLOB_EXCLUDE }];

// src/configs/javascript.ts
import globals from "globals";
var javascript = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: "module"
      },
      sourceType: "module"
    }
  }
];

// src/plugins.ts
import tseslint from "typescript-eslint";

// src/utils.ts
var parserPlain = {
  meta: {
    name: "parser-plain"
  },
  parseForESLint: (code) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: "Program"
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: []
    }
  })
};
// @__NO_SIDE_EFFECTS__
function interopDefault(m) {
  return m.default || m;
}

// src/plugins.ts
import * as _pluginVue from "eslint-plugin-vue";
import * as _pluginReact from "eslint-plugin-react/configs/recommended.js";
import * as _pluginSolid from "eslint-plugin-solid/configs/typescript.js";
import * as _pluginAstro from "eslint-plugin-astro";
import * as _pluginPrettier from "eslint-plugin-prettier";
import * as _configPrettier from "eslint-config-prettier";
import * as _pluginFormat from "eslint-plugin-format";
import * as parserVue from "vue-eslint-parser";
import * as parserAstro from "astro-eslint-parser";
var pluginVue = interopDefault(_pluginVue);
var pluginReact = interopDefault(_pluginReact);
var pluginSolid = interopDefault(_pluginSolid);
var pluginAstro = interopDefault(_pluginAstro);
var pluginPrettier = interopDefault(_pluginPrettier);
var configPrettier = interopDefault(_configPrettier);
var pluginFormat = interopDefault(_pluginFormat);

// src/configs/prettier.ts
var prettierConflictRules = { ...configPrettier.rules };
delete prettierConflictRules["vue/html-self-closing"];
var prettier = [
  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      ...prettierConflictRules,
      ...pluginPrettier.configs.recommended.rules
    }
  }
];

// src/configs/typescript.ts
var typescriptCore = tseslint.config({
  files: [GLOB_TS, GLOB_TSX],
  extends: [...tseslint.configs.recommended],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/triple-slash-reference": "off"
  }
});
var typescript = [
  ...typescriptCore,
  {
    files: [GLOB_JS, "**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off"
    }
  }
];

// src/configs/vue.ts
var vue = [
  ...tseslint.config({
    extends: typescriptCore,
    files: [GLOB_VUE]
  }),
  {
    name: "renovamen/vue",
    files: [GLOB_VUE],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: [".vue"],
        parser: "@typescript-eslint/parser",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      vue: pluginVue
    },
    processor: pluginVue.processors[".vue"],
    rules: {
      ...pluginVue.configs["base"].rules,
      ...pluginVue.configs["vue3-essential"].rules,
      "vue/no-v-html": "off",
      "vue/multi-word-component-names": "off"
    }
  }
];

// src/configs/react.ts
var react = [
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    name: "renovamen/react",
    files: [GLOB_TSX],
    plugins: pluginReact.plugins,
    rules: {
      ...pluginReact.rules,
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "off"
    }
  }
];

// src/configs/solid.ts
var solid = [
  {
    name: "renovamen/solid",
    files: [GLOB_TSX],
    plugins: pluginSolid.plugins,
    rules: {
      ...pluginSolid.rules,
      "solid/no-innerhtml": "off"
    }
  }
];

// src/configs/astro.ts
var astro = [...pluginAstro.configs["flat/recommended"]];
var astroFormat = [
  {
    name: "renovamen/astro-format",
    files: [GLOB_ASTRO],
    languageOptions: {
      parser: parserPlain
    },
    plugins: {
      format: pluginFormat
    },
    rules: {
      "prettier/prettier": "off",
      "format/prettier": [
        "error",
        {
          trailingComma: "none",
          printWidth: 90,
          parser: "astro",
          plugins: ["prettier-plugin-astro"]
        }
      ]
    }
  }
];

// src/env.ts
import process from "node:process";
import { isPackageExists } from "local-pkg";
var isInEditor = !!((process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM) && !process.env.CI);
var hasTypeScript = isPackageExists("typescript");
var hasVue = isPackageExists("vue") || isPackageExists("nuxt") || isPackageExists("vitepress");
var hasReact = isPackageExists("react") || isPackageExists("next");
var hasSolid = isPackageExists("solid-js") || isPackageExists("@solidjs/start");
var hasAstro = isPackageExists("astro");

// src/presets.ts
var presetJavaScript = [...ignores, ...javascript];
var presetBasic = [...presetJavaScript, ...typescript];
function renovamen(config = [], {
  prettier: enablePrettier = true,
  vue: enableVue = hasVue,
  react: enableReact = hasReact,
  solid: enableSolid = hasSolid,
  astro: enableAstro = hasAstro
} = {}) {
  const configs = [...presetBasic];
  if (enablePrettier)
    configs.push(...prettier);
  if (enableAstro) {
    configs.push(...astroFormat);
    configs.push(...astro);
  }
  if (enableVue)
    configs.push(...vue);
  if (enableReact)
    configs.push(...react);
  if (enableSolid)
    configs.push(...solid);
  if (Object.keys(config).length > 0) {
    configs.push(...Array.isArray(config) ? config : [config]);
  }
  return configs;
}
export {
  GLOB_ASTRO,
  GLOB_DIST,
  GLOB_EXCLUDE,
  GLOB_JS,
  GLOB_JSX,
  GLOB_LOCKFILE,
  GLOB_NODE_MODULES,
  GLOB_TS,
  GLOB_TSX,
  GLOB_VUE,
  astro,
  astroFormat,
  configPrettier,
  hasAstro,
  hasReact,
  hasSolid,
  hasTypeScript,
  hasVue,
  ignores,
  isInEditor,
  javascript,
  parserAstro,
  parserVue,
  pluginAstro,
  pluginFormat,
  pluginPrettier,
  pluginReact,
  pluginSolid,
  pluginVue,
  presetBasic,
  presetJavaScript,
  prettier,
  react,
  renovamen,
  solid,
  tseslint,
  typescript,
  typescriptCore,
  vue
};
