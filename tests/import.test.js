import { describe, expect, test } from "@jest/globals";
import { i18nImport } from "../import.js";

function resetGlobals() {
    global.strings = [];
    global.content =
        `{
          "test.string": "The quick brown fox jumps over the lazy dog",
          "test.plural": "{count} fox | {count} foxes",
          "test.zero": "No foxes spotted | Saw {count} fox | ` +
        `Saw {count} foxes"
         }`;
    global.error = undefined;
    global.targetLanguages = [
        {
            id: "es-ES",
            name: "Spanish",
            editorCode: "es",
            twoLettersCode: "es",
            threeLettersCode: "spa",
            locale: "es-ES",
            androidCode: "es-rES",
            osxCode: "es.lproj",
            osxLocale: "es",
            pluralCategoryNames: ["one", "other"],
            pluralRules: "(n != 1)",
        },
        {
            id: "ja-JP",
            name: "Japanese",
            editorCode: "ja",
            twoLettersCode: "ja",
            threeLettersCode: "jpn",
            locale: "ja-JP",
            androidCode: "ja-rJP",
            osxCode: "jp.lproj",
            osxLocale: "jp",
            pluralCategoryNames: ["other"],
            pluralRules: "",
        },
    ];
}

describe("i18nImport", () => {
    // Set global Crowding variables before testing.
    beforeAll(() => {
        resetGlobals();

        i18nImport();
    });

    test("Should populate strings", () => {
        expect(global.strings).toHaveLength(4);
        expect(global.strings).toStrictEqual([
            {
                identifier: "test.string",
                text: "The quick brown fox jumps over the lazy dog",
                translations: {
                    "es-ES": {
                        status: "translated",
                        text: "The quick brown fox jumps over the lazy dog",
                    },
                    "ja-JP": {
                        status: "translated",
                        text: "The quick brown fox jumps over the lazy dog",
                    },
                },
            },
            {
                hasPlurals: true,
                identifier: "test.plural",
                text: {
                    one: "{count} fox",
                    other: "{count} foxes",
                },
                translations: {
                    "es-ES": {
                        status: {
                            one: "translated",
                            other: "translated",
                        },
                        text: {
                            one: "{count} fox",
                            other: "{count} foxes",
                        },
                    },
                    "ja-JP": {
                        status: {
                            other: "translated",
                        },
                        text: {
                            other: "{count} foxes",
                        },
                    },
                },
            },
            {
                identifier: "test.zero.zero",
                text: "No foxes spotted",
                translations: {
                    "es-ES": {
                        status: "translated",
                        text: "No foxes spotted",
                    },
                    "ja-JP": {
                        status: "translated",
                        text: "No foxes spotted",
                    },
                },
            },
            {
                hasPlurals: true,
                identifier: "test.zero",
                text: {
                    one: "Saw {count} fox",
                    other: "Saw {count} foxes",
                },
                translations: {
                    "es-ES": {
                        status: {
                            one: "translated",
                            other: "translated",
                        },
                        text: {
                            one: "Saw {count} fox",
                            other: "Saw {count} foxes",
                        },
                    },
                    "ja-JP": {
                        status: {
                            other: "translated",
                        },
                        text: {
                            other: "Saw {count} foxes",
                        },
                    },
                },
            },
        ]);
    });

    test("Should not return any error", () => {
        expect(global.error).toBeUndefined();
    });

    describe("Special keys", () => {
        beforeAll(() => {
            resetGlobals();

            global.content = `
                {
                  "_.code": "en-US",
                  "_.name": "English (United States)",
                  "test.string": "The quick brown fox jumps over the lazy dog"
                }`;

            i18nImport();
        });

        test("Should have context", () => {
            expect(global.strings).toHaveLength(3);
            expect(global.strings).toStrictEqual([
                {
                    context:
                        "Locale code of the language you're translating to, " +
                        "including region code, following IETF BCP 47 " +
                        'standard. E.g. "fr-FR" for french or "fr-CA" ' +
                        "for canadian french.",
                    identifier: "_.code",
                    text: "en-US",
                    translations: {
                        "es-ES": { status: "translated", text: "en-US" },
                        "ja-JP": { status: "translated", text: "en-US" },
                    },
                },
                {
                    context:
                        "Locale name of the language you're translating to. " +
                        'E.g. "Français" for french or "Français (Canada)" ' +
                        "for canadian french.",
                    identifier: "_.name",
                    text: "English (United States)",
                    translations: {
                        "es-ES": {
                            status: "translated",
                            text: "English (United States)",
                        },
                        "ja-JP": {
                            status: "translated",
                            text: "English (United States)",
                        },
                    },
                },
                {
                    identifier: "test.string",
                    text: "The quick brown fox jumps over the lazy dog",
                    translations: {
                        "es-ES": {
                            status: "translated",
                            text: "The quick brown fox jumps over the lazy dog",
                        },
                        "ja-JP": {
                            status: "translated",
                            text: "The quick brown fox jumps over the lazy dog",
                        },
                    },
                },
            ]);
        });
    });

    describe("Unsplittable keys", () => {
        beforeAll(() => {
            resetGlobals();

            global.content = `
                {
                  "test.split": "one | other",
                  "test.dontsplit": "one | other"
                }`;

            i18nImport((unsplittableKeys = ["test.dontsplit"]));
        });

        test("Should not be split", () => {
            expect(global.strings).toHaveLength(2);
            expect(global.strings).toStrictEqual([
                {
                    hasPlurals: true,
                    identifier: "test.split",
                    text: {
                        one: "one",
                        other: "other",
                    },
                    translations: {
                        "es-ES": {
                            status: {
                                one: "translated",
                                other: "translated",
                            },
                            text: {
                                one: "one",
                                other: "other",
                            },
                        },
                        "ja-JP": {
                            status: {
                                other: "translated",
                            },
                            text: {
                                other: "other",
                            },
                        },
                    },
                },
                {
                    identifier: "test.dontsplit",
                    text: "one | other",
                    translations: {
                        "es-ES": {
                            status: "translated",
                            text: "one | other",
                        },
                        "ja-JP": {
                            status: "translated",
                            text: "one | other",
                        },
                    },
                },
            ]);
        });
    });

    describe("With invalid plural count", () => {
        beforeAll(() => {
            resetGlobals();

            global.content =
                `{
                "test.string": "The quick brown fox jumps over the lazy dog",
                "test.plural": "{count} fox | {count} foxes",
                "test.zero": "No foxes spotted | Saw {count} fox | ` +
                `Saw {count} foxes",
                "test.tooMuchValues": "1 fox | 2 foxes | 3 foxes | 4 foxes"
            }`;

            i18nImport();
        });

        test("Should return an error in case of invalid plurals count", () => {
            expect(global.error).toBe(
                "test.tooMuchValues: Invalid plurals count in source " +
                    "language (4).",
            );
        });
    });

    describe("With invalid target language plurals", () => {
        beforeAll(() => {
            resetGlobals();

            global.targetLanguages = [
                {
                    id: "es-ES",
                    name: "Spanish",
                    editorCode: "es",
                    twoLettersCode: "es",
                    threeLettersCode: "spa",
                    locale: "es-ES",
                    androidCode: "es-rES",
                    osxCode: "es.lproj",
                    osxLocale: "es",
                    pluralCategoryNames: ["xxxx", "yyyy"],
                    pluralRules: "(n != 1)",
                },
            ];

            i18nImport();
        });

        test(
            "Should return an error in case of unsupported " +
                "pluralCategoryNames",
            () => {
                expect(global.error).toBe(
                    "Unsupported plurals forms for spanish language: xxxx, " +
                        "yyyy.",
                );
            },
        );
    });
});
