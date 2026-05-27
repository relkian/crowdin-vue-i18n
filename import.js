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
 * When importing translations, *ALWAYS* check "Allow target translation to
 * match source" to avoid breaking plurals strings import.
 * If some strings are not updated in the singular and/or the plural THIS is the
 * cause of the issue.
 */

function translationsPluralsOneOther(values, hasZero) {
    // Zero, One, Other.
    if (hasZero) {
        /*
         * "zero" plural form has already been set in a separate key
         * using the same key name prefixed by ".zero", see call to
         * handleI18nKey() below.
         */
        return {
            text: {
                one: values[1],
                other: values[2],
            },
            status: {
                one: "translated",
                other: "translated",
            },
        };
    }

    // One, Other.
    return {
        text: {
            one: values[0],
            other: values[1],
        },
        status: {
            one: "translated",
            other: "translated",
        },
    };
}

function translationsPluralsOther(values, hasZero) {
    /*
     * For languages who don't have plurals, we get the second JSON value (or
     * the third if the key has a "zero" form as first value) as "other" value.
     */

    // Zero, Other.
    if (hasZero) {
        /*
         * "zero" plural form has already been set in a separate key using the
         * same key name prefixed by ".zero", see call to handleI18nKey() above.
         */
        return {
            text: {
                other: values[2],
            },
            status: {
                other: "translated",
            },
        };
    }

    // Other.
    return {
        text: {
            other: values[1],
        },
        status: {
            other: "translated",
        },
    };
}

function handleI18nKey(name, values) {
    const string = {
        identifier: name,
    };

    // Add translation context for special key "_.code".
    if (name === "_.code") {
        string.context =
            "Locale code of the language you're translating to, including " +
            'region code, following IETF BCP 47 standard. E.g. "fr-FR" for ' +
            'french or "fr-CA" for canadian french.';
    }

    // Add translation context for special key "_.code".
    if (name === "_.name") {
        string.context =
            "Locale name of the language you're translating to. E.g. " +
            '"Français" for french or "Français (Canada)" for canadian ' +
            "french.";
    }

    let pluralsCount = values.length;

    // Source string has plurals.
    if (pluralsCount > 1) {
        string.hasPlurals = true;

        // One, Other.
        if (pluralsCount == 2) {
            string.text = {
                one: values[0],
                other: values[1],
            };

            // Zero, One, Other.
        } else if (pluralsCount == 3) {
            /*
             * Crowdin only show "zero" plural when the language supports it,
             * which is not the case for most languages (see:
             * https://www.unicode.org/cldr/charts/48/supplemental/
             * language_plural_rules.html).
             *
             * We can create custom languages with custom plural forms, but
             * Crowdin doesn't support setting them as project source language,
             * so that doesn't solve the issue neither.
             *
             * So we just put the string in a separate key, prefixed by ".zero".
             */
            string.text = {
                one: values[1],
                other: values[2],
            };

            handleI18nKey(name + ".zero", [values[0]]);

            // Invalid plurals count.
        } else {
            errors.push(
                name +
                    ": Invalid plurals count in source language (" +
                    pluralsCount +
                    ").",
            );

            return;
        }

        // Source string has NO plurals.
    } else {
        string.text = values[0];
    }

    string.translations = {};
    for (const lang of targetLanguages) {
        // Source string has plurals.
        if (string.hasPlurals === true) {
            /*
             * Target language use Indo-European languages plurals forms
             * (one, other).
             */
            if (lang.pluralCategoryNames.join("") === "oneother") {
                string.translations[lang.id] = translationsPluralsOneOther(
                    values,
                    pluralsCount == 3,
                );

                // Target langage has no plural form (other).
            } else if (lang.pluralCategoryNames.join("") === "other") {
                string.translations[lang.id] = translationsPluralsOther(
                    values,
                    /*
                     * Even if the language as no plurals there's still "fake"
                     * plurals in the language file.
                     */
                    pluralsCount == 3,
                );
            } else {
                message =
                    "Unsupported plurals forms for " +
                    lang.name.toLowerCase() +
                    " language: " +
                    lang.pluralCategoryNames.join(", ") +
                    ".";

                if (!errors.includes(message)) {
                    errors.push(message);
                }

                // Skip this language.
                continue;
            }

            // Translation has NO plurals.
        } else {
            string.translations[lang.id] = {
                text: values[0],
                status: "translated",
            };
        }
    }

    // "strings" is a global variable defined by Crowdin environment.
    strings.push(string);
}

function i18nImport(unsplittableKeys = []) {
    // Clear errors from previous executions (needed for testing).
    errors = [];
    // "content" variable contains the source file content in UTF-8 encoding.
    const data = JSON.parse(content);

    for (const [key, value] of Object.entries(data)) {
        /*
         *    "No apples | {count} apple | {count} apples"
         * => ["No apples", "{count} apple", "{count} apples"]
         */
        if (unsplittableKeys.includes(key)) {
            values = [value];
        } else {
            values = value.split(" | ");
        }

        handleI18nKey(key, values);
    }

    if (errors.length) {
        // "error" is a global variable defined by Crowdin environment.
        error = errors.join("\n");
    }
}

// Global errors list.
var errors = [];

/* istanbul ignore next
 *
 * Run i18nImport() only if we're in Crowdin environment.
 */
if (typeof content !== "undefined") {
    // List of keys whose values contain " | " but should NOT be split.
    const unsplittableKeys = ["admin.inbox.livechat.greetingMessage.variables"];

    i18nImport(unsplittableKeys);
}

/*
 * Export i18nImport() function for testing.
 *
 * REMOVE THE LINE BELOW BEFORE PASTING THIS SCRIPT INTO CROWDIN CFF MODULE
 * SETTINGS OTHERWISE IMPORTS WILL FAIL.
 */
export { i18nImport };
