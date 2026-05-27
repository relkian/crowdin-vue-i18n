import { describe, expect, test } from "@jest/globals";
import { i18nExport } from "../export.js";
import frFixture from "./fixtures/export/fr-FR.json" with { type: "json" };
import jaFixture from "./fixtures/export/ja-JP.json" with { type: "json" };

describe("i18nExport", () => {
    // Set global Crowding variables before testing.
    beforeAll(() => {
        global.strings = [
            {
                identifier: "test.string",
                text: "The quick brown fox jumps over the lazy dog",
                translations: {
                    fr: {
                        text: "Le renard brun rapide saute par-dessus le chien paresseux",
                        status: "translated",
                    },
                },
            },
            {
                identifier: "test.plural",
                hasPlurals: true,
                text: {
                    one: "{count} fox",
                    other: "{count} foxes",
                },
                translations: {
                    fr: {
                        text: {
                            one: "{count} fox",
                            other: "{count} renards",
                        },
                        status: {
                            one: "untranslated",
                            other: "translated",
                        },
                    },
                },
            },
            {
                identifier: "test.pluralWithZero.zero",
                text: "No foxes spotted",
                translations: {
                    fr: {
                        text: "Aucun renard aperçu",
                        status: "approved",
                    },
                },
            },
            {
                identifier: "test.pluralWithZero",
                hasPlurals: true,
                text: {
                    one: "Saw {count} fox",
                    other: "Saw {count} foxes",
                },
                translations: {
                    fr: {
                        text: {
                            one: "Vu {count} renard",
                            other: "Vu {count} renards",
                        },
                        status: {
                            one: "translated",
                            other: "translated",
                        },
                    },
                },
            },
            {
                identifier: "test.approvedButEmpty",
                text: "No foxes spotted",
                translations: {
                    fr: {
                        // Empty translation.
                        text: "",
                        status: "approved",
                    },
                },
            },
            {
                identifier: "test.approvedButEmptyPlural",
                hasPlurals: true,
                text: {
                    one: "Saw {count} fox",
                    other: "Saw {count} foxes",
                },
                translations: {
                    fr: {
                        text: {
                            // Only one of the translations is empty.
                            one: "",
                            other: "Vu {count} renards",
                        },
                        status: {
                            one: "translated",
                            other: "translated",
                        },
                    },
                },
            },
        ];

        i18nExport();
    });

    test("Should populate file content", () => {
        expect(global.content).toHaveLength(220);
        expect(global.content).toStrictEqual(
            `{\n` +
                `  "test.string": "Le renard brun rapide saute par-dessus le ` +
                `chien paresseux",\n` +
                `  "test.plural": "{count} fox | {count} renards",\n` +
                `  "test.pluralWithZero": "Aucun renard aperçu | Vu {count} ` +
                `renard | Vu {count} renards"\n` +
                `}\n`,
        );
    });

    describe("Target langage has no plural form", () => {
        beforeAll(() => {
            global.strings = [
                {
                    identifier: "test.string",
                    text: "The quick brown fox jumps over the lazy dog",
                    translations: {
                        jp: {
                            text: "素早い茶色のキツネが、のろまな犬を飛び越える",
                            status: "translated",
                        },
                    },
                },
                {
                    identifier: "test.plural",
                    hasPlurals: true,
                    text: {
                        one: "{count} fox",
                        other: "{count} foxes",
                    },
                    translations: {
                        jp: {
                            text: {
                                other: "{count}匹のキツネ",
                            },
                            status: {
                                other: "translated",
                            },
                        },
                    },
                },
                {
                    identifier: "test.pluralWithZero.zero",
                    text: "No foxes spotted",
                    translations: {
                        jp: {
                            text: "キツネは見かけなかった",
                            status: "approved",
                        },
                    },
                },
                {
                    identifier: "test.pluralWithZero",
                    hasPlurals: true,
                    text: {
                        one: "Saw {count} fox",
                        other: "Saw {count} foxes",
                    },
                    translations: {
                        jp: {
                            text: {
                                other: "キツネを{count}匹見た",
                            },
                            status: {
                                other: "translated",
                            },
                        },
                    },
                },
                {
                    identifier: "test.pluralUntranslated",
                    hasPlurals: true,
                    text: {
                        one: "Saw {count} fox",
                        other: "Saw {count} foxes",
                    },
                    translations: {
                        jp: {
                            text: {
                                other: "Saw {count} foxes",
                            },
                            status: {
                                // untranslated so not exported.
                                other: "untranslated",
                            },
                        },
                    },
                },
            ];

            i18nExport();
        });

        test(
            'Should populate file with "other" form as "one" form if "other" ' +
                "form has been translated",
            () => {
                expect(global.content).toHaveLength(168);
                expect(global.content).toStrictEqual(
                    `{\n` +
                        `  "test.string": "素早い茶色のキツネが、のろまな犬を飛び越` +
                        `える",\n` +
                        `  "test.plural": "{count}匹のキツネ | ` +
                        `{count}匹のキツネ",\n` +
                        `  "test.pluralWithZero": "キツネは見かけなかった | ` +
                        `キツネを{count}匹見た | キツネを{count}匹見た"\n` +
                        `}\n`,
                );
            },
        );
    });

    describe("Test full French translations export", () => {
        beforeAll(() => {
            global.strings = frFixture;

            i18nExport();
        });

        test("Should return a big string", () => {
            expect(global.content).toEqual(expect.any(String));
            expect(global.content.length).toBeGreaterThan(80000);
        });
    });

    describe("Test full Japanese translations export", () => {
        beforeAll(() => {
            global.strings = jaFixture;

            i18nExport();
        });

        test("Should return a big string", () => {
            expect(global.content).toEqual(expect.any(String));
            expect(global.content.length).toBeGreaterThan(50000);
        });
    });
});
