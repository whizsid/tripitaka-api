import { Request, Response } from 'express';
import { Controller, Get, Middleware } from '@overnightjs/core';
import { checkLocale } from '../../middlewares/checkLocale';
import fs = require('fs');
import path = require('path');

export interface IMenu {
    name: string;
    id: string;
    parent: boolean;
    childCount: number;
}

export interface IMenuWithChilds {
    name: string;
    id: string;
    childs: IMenuWithChilds[];
}

@Controller('v1/menu')
export class MenuController {

    /**
     * Returning the menu according to the language id
     *
     * @param locale Language Id
     */
    private getMenu(locale: string): IMenuWithChilds[] {

        const menuBuf = fs.readFileSync(path.join('./data/locales/auto/menu', locale + '.json'));

        const menu: IMenuWithChilds[] = JSON.parse(menuBuf.toString());

        return menu;
    }

    /**
     * Returning last part of a long id
     *
     * @param id Long Id
     */
    private getPublicId(id: string) {
        const splited = id.split('_');

        return splited[splited.length - 1];
    }

    @Get(':locale/')
    @Middleware(checkLocale)
    private showMainMenu(req: Request, res: Response) {
        const locale = req.params.locale;
        const menu = this.getMenu(locale);

        res.status(200).json({
            status: true,
            data: menu.map((menuItem) => ({
                id: menuItem.id,
                name: menuItem.name,
                parent: true,
                childCount: menuItem.childs.length,
            })),
        });
    }

    @Get(':locale/*')
    @Middleware(checkLocale)
    private showSubMenu(req: Request, res: Response) {
        const menuId = req.params[0];
        const splited = menuId.split(/\/|\\/);

        let menu = this.getMenu(req.params.locale);

        let parent: IMenu = {
            name: '',
            id: '',
            parent: false,
            childCount: 0,
        };

        for (const element of splited) {

            // tslint:disable-next-line: radix
            const number = parseInt(element.substr(1));

            if (typeof menu[number - 1] === 'undefined' || typeof menu[number - 1].childs === 'undefined') {
                res.status(404).json({
                    status: false,
                    message: 'NotFound',
                });

                return;
            }

            parent = {
                name: menu[number - 1].name,
                id: this.getPublicId(menu[number - 1].id),
                parent: true,
                childCount: menu[number - 1].childs.length,
            };

            menu = menu[number - 1].childs;

        }

        const filteredChilds: any[] = menu.map((menuItem) => ({
            id: this.getPublicId(menuItem.id),
            name: menuItem.name,
            parent: typeof menuItem.childs !== 'undefined',
            implemented: typeof menuItem.childs === 'undefined' ?
                fs.existsSync(path.join(
                    './data/locales/auto/suttas/',
                    menuId,
                    this.getPublicId(menuItem.id),
                    req.params.locale + '.json'))
                : undefined
            ,
            childCount: typeof menuItem.childs !== 'undefined' ? menuItem.childs.length : 0,
        }));

        res.status(200).json({
            status: true,
            data: { ...parent, childs: filteredChilds },
        });
    }
}
