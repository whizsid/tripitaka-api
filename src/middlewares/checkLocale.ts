import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import fs = require('fs');
import { ILocale } from 'src/translator';

export const checkLocale = (req: Request, res: Response, next: NextFunction) => {
    const locale = req.params.locale;

    if (typeof locale !== 'undefined') {

        const availableLocalesStr = fs.readFileSync('./data/locales/available.json');
        const availableLocales: ILocale[] = JSON.parse(availableLocalesStr.toString());

        if (availableLocales.map((child) => child.code).includes(locale)) {
            next();
            return;
        }

    }

    res.status(422).json({
        status: false,
        message: 'InvalidLocale',
    });

};
