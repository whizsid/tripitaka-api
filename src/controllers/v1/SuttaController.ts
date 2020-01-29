import { Request, Response } from 'express';
import { Controller, Get, Middleware } from '@overnightjs/core';
import { checkLocale } from '../../middlewares/checkLocale';
import fs = require('fs');
import path = require('path');

@Controller('v1/sutta')
export class SuttaController {

    @Get(':locale/*')
    @Middleware(checkLocale)
    private getContent(req: Request, res: Response) {
        const menuId = req.params[0];
        const locale = req.params.locale;

        const suttaPath = path.join(
            './data/locales/auto/suttas/',
            menuId,
            locale + '.json');

        if (!fs.existsSync(suttaPath)) {
            res.status(404).json({
                status: false,
                message: 'NotFound',
            });
            return;
        }

        const suttaContent = fs.readFileSync(suttaPath);

        const sutta = JSON.parse(suttaContent.toString());

        res.status(200).json(sutta);
    }
}
