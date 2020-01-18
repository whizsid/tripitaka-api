import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import fs = require('fs');

export const checkLocale = (req: Request, res: Response, next: NextFunction) => {
    const locale = req.params.locale;

    if (typeof locale !== 'undefined') {

        const availableLocalesStr = fs.readFileSync('./src/data/locales.json');
        const availableLocales: string[] = JSON.parse(availableLocalesStr.toString());

        if (availableLocales.includes(locale)) {
            next();
            return;
        }

    }

    res.status(422).json({
        status: false,
        message: 'InvalidLocale',
    });

};
