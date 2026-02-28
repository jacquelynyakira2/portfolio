"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  GLOB_ASTRO: () => GLOB_ASTRO,
  GLOB_DIST: () => GLOB_DIST,
  GLOB_EXCLUDE: () => GLOB_EXCLUDE,
  GLOB_JS: () => GLOB_JS,
  GLOB_JSX: () => GLOB_JSX,
  GLOB_LOCKFILE: () => GLOB_LOCKFILE,
  GLOB_NODE_MODULES: () => GLOB_NODE_MODULES,
  GLOB_TS: () => GLOB_TS,
  GLOB_TSX: () => GLOB_TSX,
  GLOB_VUE: () => GLOB_VUE,
  astro: () => astro,
  astroFormat: () => astroFormat,
  configPrettier: () => configPrettier,
  hasAstro: () => hasAstro,
  hasReact: () => hasReact,
  hasSolid: () => hasSolid,
  hasTypeScript: () => hasTypeScript,
  hasVue: () => hasVue,
  ignores: () => ignores,
  isInEditor: () => isInEditor,
  javascript: () => javascript,
  parserAstro: () => parserAstro,
  parserVue: () => parserVue,
  pluginAstro: () => pluginAstro,
  pluginFormat: () => pluginFormat,
  pluginPrettier: () => pluginPrettier,
  pluginReact: () => pluginReact,
  pluginSolid: () => pluginSolid,
  pluginVue: () => pluginVue,
  presetBasic: () => presetBasic,
  presetJavaScript: () => presetJavaScript,
  prettier: () => prettier,
  react: () => react,
  renovamen: () => renovamen,
  solid: () => solid,
  tseslint: () => import_typescript_eslint.default,
  typescript: () => typescript,
  typescriptCore: () => typescriptCore,
  vue: () => vue
});
module.exports = __toCommonJS(src_exports);

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
var import_globals = __toESM(require("globals"), 1);
var javascript = [
  {
    languageOptions: {
      globals: {
        ...import_globals.default.browser,
        ...import_globals.default.es2021,
        ...import_globals.default.node
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
var import_typescript_eslint = __toESM(require("typescript-eslint"), 1);

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
var _pluginVue = __toESM(require("eslint-plugin-vue"), 1);
var _pluginReact = __toESM(require("eslint-plugin-react/configs/recommended.js"), 1);
var _pluginSolid = __toESM(require("eslint-plugin-solid/configs/typescript.js"), 1);
var _pluginAstro = __toESM(require("eslint-plugin-astro"), 1);
var _pluginPrettier = __toESM(require("eslint-plugin-prettier"), 1);
var _configPrettier = __toESM(require("eslint-config-prettier"), 1);
var _pluginFormat = __toESM(require("eslint-plugin-format"), 1);
var parserVue = __toESM(require("vue-eslint-parser"), 1);
var parserAstro = __toESM(require("astro-eslint-parser"), 1);
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
var typescriptCore = import_typescript_eslint.default.config({
  files: [GLOB_TS, GLOB_TSX],
  extends: [...import_typescript_eslint.default.configs.recommended],
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
  ...import_typescript_eslint.default.config({
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
      "@typescript-eslint": import_typescript_eslint.default.plugin,
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
var import_node_process = __toESM(require("process"), 1);
var import_local_pkg = require("local-pkg");
var isInEditor = !!((import_node_process.default.env.VSCODE_PID || import_node_process.default.env.VSCODE_CWD || import_node_process.default.env.JETBRAINS_IDE || import_node_process.default.env.VIM) && !import_node_process.default.env.CI);
var hasTypeScript = (0, import_local_pkg.isPackageExists)("typescript");
var hasVue = (0, import_local_pkg.isPackageExists)("vue") || (0, import_local_pkg.isPackageExists)("nuxt") || (0, import_local_pkg.isPackageExists)("vitepress");
var hasReact = (0, import_local_pkg.isPackageExists)("react") || (0, import_local_pkg.isPackageExists)("next");
var hasSolid = (0, import_local_pkg.isPackageExists)("solid-js") || (0, import_local_pkg.isPackageExists)("@solidjs/start");
var hasAstro = (0, import_local_pkg.isPackageExists)("astro");

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
