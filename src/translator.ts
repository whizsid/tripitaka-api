import PO = require('pofile');
import fs = require('fs');
import glob = require('glob');
import path = require('path');

const languages: string[] = JSON.parse(fs.readFileSync('./src/data/languages.json').toString());

for (const lang of languages) {
    PO.load('./src/data/locales/' + languages + '.po', (err, po) => {

        glob.sync('./src/data/templates/*.json').forEach((file) => {

            if (!fs.existsSync(path.join('./src/data/auto/', lang))) {
                fs.mkdirSync(path.join('./src/data/auto/', lang));
            }

            const newFilePath = path.join('./src/data/auto/', lang, path.basename(file));

            let content = fs.readFileSync(file).toString();

            po.items.forEach((item) => {
                const translated = item.msgstr.join('') === '' ? 
                    item.msgctxt : item.msgstr.join('');

                if (typeof translated !== 'undefined') {
                    content = content.replace(`\\\\\{${item.msgid}\\\\\}`, translated);
                }
            });

            if (fs.existsSync(newFilePath)) {
                fs.unlinkSync(newFilePath);
            }

            fs.writeFileSync(newFilePath, content);
        });

    });
}
