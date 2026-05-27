/*
 * Version: 2.0.0 (2026-05-26).
 *
 * Copyright (c) 2026 Jonathan Leroy EI (Relkian).
 *
 * Related Crowdin documentation:
 *  - https://support.crowdin.com/developer/
 * crowdin-apps-module-custom-file-format/#strings-array-structure
 *  - https://crowdin.com/store/apps/cff
 *
 */

function handlePlurals(string, lang) {
    /*
     * We check if this key has a zero plural form (see
     * import script).
     */
    zeroform = strings.find((k) => {
        return (
            k.translations[lang].text &&
            k.identifier === string.identifier + ".zero"
        );
    });

    // One, Other.
    if (string.translations[lang].text.one !== undefined) {
        oneform = string.translations[lang].text.one;

        // Other.
    } else {
        oneform = string.translations[lang].text.other;
    }

    if (zeroform) {
        /*
         * Concat "zero", "one" and "other" plurals
         * forms.
         *
         * {
         *   "identifier": "example.string.zero",
         *   "text": "No foxes spotted",
         *   "translations": {...}
         * },
         * {
         *   "hasPlurals": true,
         *   "identifier": "example.string",
         *   "text": {
         *     "one": "Saw {count} fox",
         *     "other": "Saw {count} foxes"
         *   },
         *   "translations": {...}
         * }
         *
         * ==>
         *
         * {
         *   "example.string": "No foxes spotted | Saw {count} fox |
         *      Saw {count} foxes"
         * }
         */
        return [
            zeroform.translations[lang].text,
            oneform,
            string.translations[lang].text.other,
        ].join(" | ");
    }

    return [oneform, string.translations[lang].text.other].join(" | ");
}

function i18nExport() {
    // JSON array to export.
    const data = {};

    for (const string of strings) {
        for (const lang in string.translations) {
            if (string.hasPlurals) {
                /*
                 * If *at least one* of the translations is empty or if
                 * this string has no translated form, do not include it
                 * in export.
                 */
                if (
                    Object.values(string.translations[lang].text).some(
                        (x) => x === false,
                    ) ||
                    Object.values(string.translations[lang].text).some(
                        (x) => x.trim() === "",
                    ) ||
                    Object.values(string.translations[lang].status).every(
                        (x) => x === "untranslated",
                    )
                ) {
                    // Next language.
                    continue;
                }

                data[string.identifier] = handlePlurals(string, lang);
            } else {
                /*
                 * String is tranlated, and translation key doen't end with
                 * ".zero" (zero plural form, see import script).
                 */
                if (
                    string.translations[lang].text &&
                    string.translations[lang].text.trim() !== "" &&
                    string.translations[lang].status !== "untranslated" &&
                    string.identifier.endsWith(".zero") !== true
                ) {
                    data[string.identifier] = string.translations[lang].text;
                }
            }
        }
    }

    // Overwrite content variable with the generated JSON.
    content = JSON.stringify(data, null, 2);
    // Add newline at end of file.
    content += "\n";
}

/* istanbul ignore next
 *
 * Run i18nExport() only if we're in Crowdin environment.
 */
if (typeof strings !== "undefined") {
    i18nExport();
}

/*
 * Export i18nExport() function for testing.
 *
 * REMOVE THE LINE BELOW BEFORE PASTING THIS SCRIPT INTO CROWDIN CFF MODULE
 * SETTINGS OTHERWISE EXPORTS WILL FAIL.
 */
export { i18nExport };
