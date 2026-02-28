import * as eslint from 'eslint';
import { Linter } from 'eslint';
import * as vueEslintParser from 'vue-eslint-parser';
export { vueEslintParser as parserVue };
import * as astroEslintParser from 'astro-eslint-parser';
export { astroEslintParser as parserAstro };
export { default as tseslint } from 'typescript-eslint';

declare const ignores: Linter.FlatConfig[];

declare const javascript: Linter.FlatConfig[];

declare const prettier: Linter.FlatConfig[];

declare const typescriptCore: Linter.FlatConfig<Linter.RulesRecord>[];
declare const typescript: Linter.FlatConfig[];

declare const vue: Linter.FlatConfig[];

declare const react: Linter.FlatConfig[];

declare const solid: Linter.FlatConfig[];

declare const astro: Linter.FlatConfig[];
declare const astroFormat: Linter.FlatConfig[];

declare const isInEditor: boolean;
declare const hasTypeScript: boolean;
declare const hasVue: boolean;
declare const hasReact: boolean;
declare const hasSolid: boolean;
declare const hasAstro: boolean;

declare const GLOB_JS = "**/*.?([cm])js";
declare const GLOB_JSX = "**/*.?([cm])jsx";
declare const GLOB_TS = "**/*.?([cm])ts";
declare const GLOB_TSX = "**/*.?([cm])tsx";
declare const GLOB_VUE = "**/*.vue";
declare const GLOB_ASTRO = "**/*.astro";
declare const GLOB_NODE_MODULES: "**/node_modules";
declare const GLOB_DIST: "**/dist";
declare const GLOB_LOCKFILE: string[];
declare const GLOB_EXCLUDE: string[];

declare const pluginVue: any;
declare const pluginReact: any;
declare const pluginSolid: any;
declare const pluginAstro: {
    meta: {
        name: string;
        version: string;
    };
    environments: {
        astro: {
            globals: {
                Astro: boolean;
                Fragment: boolean;
            };
        };
    };
    rules: {
        [key: string]: eslint.Rule.RuleModule;
    };
    processors: {
        ".astro": eslint.Linter.Processor<string | eslint.Linter.ProcessorFile>;
        astro: eslint.Linter.Processor<string | eslint.Linter.ProcessorFile>;
        "client-side-ts": eslint.Linter.Processor<string | eslint.Linter.ProcessorFile>;
    };
} & {
    configs: {
        base: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        recommended: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        all: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "jsx-a11y-strict": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "jsx-a11y-recommended": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "flat/base": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "flat/recommended": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "flat/all": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "flat/jsx-a11y-strict": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
        "flat/jsx-a11y-recommended": eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>[];
    };
};
declare const pluginPrettier: eslint.ESLint.Plugin;
declare const configPrettier: any;
declare const pluginFormat: {
    parserPlain: eslint.ESLint.ObjectMetaProperties & {
        parseForESLint(text: string, options?: any): eslint.Linter.ESLintParseResult;
    };
    rules: {
        prettier: {
            meta: {
                type: "layout";
                docs: {
                    description: string;
                    category: string;
                };
                fixable: "whitespace";
                schema: {
                    type: "object";
                    properties: {
                        parser: {
                            type: "string";
                            required: true;
                        };
                    };
                    additionalProperties: true;
                }[];
                messages: {
                    insert: string;
                    delete: string;
                    replace: string;
                };
            };
            create(context: eslint.Rule.RuleContext): {
                Program(): void;
            };
        };
        dprint: {
            meta: {
                type: "layout";
                docs: {
                    description: string;
                    category: string;
                };
                fixable: "whitespace";
                schema: {
                    type: "object";
                    properties: {
                        language: {
                            type: "string";
                            required: true;
                        };
                        languageOptions: {
                            type: "object";
                        };
                    };
                    additionalProperties: true;
                }[];
                messages: {
                    insert: string;
                    delete: string;
                    replace: string;
                };
            };
            create(context: eslint.Rule.RuleContext): {
                Program(): void;
            };
        };
    };
};

declare const presetJavaScript: Linter.FlatConfig<Linter.RulesRecord>[];
declare const presetBasic: Linter.FlatConfig<Linter.RulesRecord>[];
/**
 *
 * @param config
 * @param features
 * @returns
 */
declare function renovamen(config?: Linter.FlatConfig | Linter.FlatConfig[], { prettier: enablePrettier, vue: enableVue, react: enableReact, solid: enableSolid, astro: enableAstro }?: Partial<{
    /** Vue support. Auto-enable. */
    vue: boolean;
    /** React support. Auto-enable. */
    react: boolean;
    /** Solid support. Auto-enable. */
    solid: boolean;
    /** Astro support. Auto-enable. */
    astro: boolean;
    /** Prettier support. Default: true */
    prettier: boolean;
}>): Linter.FlatConfig[];

export { GLOB_ASTRO, GLOB_DIST, GLOB_EXCLUDE, GLOB_JS, GLOB_JSX, GLOB_LOCKFILE, GLOB_NODE_MODULES, GLOB_TS, GLOB_TSX, GLOB_VUE, astro, astroFormat, configPrettier, hasAstro, hasReact, hasSolid, hasTypeScript, hasVue, ignores, isInEditor, javascript, pluginAstro, pluginFormat, pluginPrettier, pluginReact, pluginSolid, pluginVue, presetBasic, presetJavaScript, prettier, react, renovamen, solid, typescript, typescriptCore, vue };
