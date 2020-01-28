import PO = require('pofile');
import fs = require('fs');
import glob = require('glob');
import path = require('path');

interface ILocale {
    code: string;
    name: string;
}

interface IPoItem {
    msgctxt?: string;
    msgid: string;
    msgstr: string[];
}

const languages: ILocale[] = JSON.parse(
    fs.readFileSync('./data/locales/available.json').toString(),
);

for (const lang of languages) {
    console.log('Translating: ' + lang.name);

    let menuPO: IPoItem[] = [];

    glob.sync('./data/locales/translations/**/' + lang.code + '.po').forEach((file) => {
        const poFilePath = path.dirname(path.relative('./data/locales/translations/', file));

        let template =
            fs.readFileSync(path.join('./data/templates/', poFilePath + '.json')).toString();

        PO.load(file, (err, po) => {


            po.items.forEach((section) => {

                const translated = typeof section.msgstr !== 'undefined'
                    && section.msgstr.join().trim() !== '' ?
                    section.msgstr.join('\n').trim() : section.msgid;

                const escaped = JSON.stringify(translated);

                template = template.replace(
                    `\\\\{${section.msgctxt}\\\\}`,
                    escaped.substr(1).substr(0, escaped.length - 2),
                );
            });

            if (poFilePath === 'menu') {
                menuPO = po.items;
            } else {
                menuPO.forEach((section) => {
                    const translated = typeof section.msgstr !== 'undefined'
                        && section.msgstr.join().trim() !== '' ?
                        section.msgstr.join('\n').trim() : section.msgid;

                    const escaped = JSON.stringify(translated);

                    template = template.replace(
                        `\\\\{${section.msgctxt}\\\\}`,
                        escaped.substr(1).substr(0, escaped.length - 2),
                    );
                });
            }

            const compiledFileName = path.join('./data/locales/auto/', poFilePath, lang.code + '.json');

            fs.mkdirSync(path.dirname(compiledFileName), {
                recursive: true,
            });

            fs.writeFileSync(
                compiledFileName,
                template,
            );
        });
    });

}
