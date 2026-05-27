# Crowdin Vue I18n localization files support

These scripts allow you translate your Vue I18n localization files using Crowdin
and its Crowdin [Custom File Format](https://crowdin.com/store/apps/cff) parser.

These scripts only support flat JSON files like this one:

```json
{
  "eg.string": "The quick brown fox jumps over the lazy dog",
  "eg.plural": "{count} fox | {count} foxes",
  "eg.withZero": "No foxes spotted | Saw {count} fox | Saw {count} foxes"
}
```

They are also limited to the following plurals forms: `One, Other`,
`Zero, One, Other` and `Other`. This covers most Indo-European languages as
well as Chinese, Japanese, Korean, etc.

They **don't** supports languages using multiples pluralization rules (e.g.
`One, Few, Many, Other`) like Slavic languages (Russian, Ukrainian, Polish,
Czech, etc.).

## Configuration

1. Add Crowdin "[Custom File Format](https://crowdin.com/store/apps/cff)" app
to your Crowdin project
2. Go to your project *Settings* tab > *Parser configuration* > 
*Custom File Format* then select *Edit*
3. Paste the content of [import.js](
https://github.com/relkian/crowdin-vue-i18n/raw/refs/heads/main/import.js)
into the "Import Code" text area
4. Don't forget to remove the last line of the script, otherwise imports will
fail!
5. Paste the content of [export.js](
https://github.com/relkian/crowdin-vue-i18n/raw/refs/heads/main/export.js)
into the "Export Code" text area
6. Don't forget to remove the last line of the script, otherwise exports will
fail!
7. Scroll to the bottom of the page and submit the form


> [!IMPORTANT]
> You can't use both Custom File Format app and others files parsers in the
> same Crowdin project. Adding the Custom File Format to your Crowdin project
> will disable any other parsers.


> [!WARNING]
> Crowdin seems to cache generated translation files for a certain period of
> time.
>
> If you make changes to the **export** script but don't see any changes
> in the generated files, go to the string editor (*Dashboard* > *[Language]* >
> *[File]*), then edit a translation and save it. This should be done for
> **each** language whose file is not being updated.
>
> Also, if you make changes to the **import** script and want to reimport the
> last revision of a file, you must add/remove a key in it otherwise Crowdin
> will not send back the file to the Custom File Format parser.


## Developers

Installing dependencies:

```sh
pnpm install
```

Running tests:

```sh
pnpm test
```

Running coverage check:

```sh
pnpm coverage
```
