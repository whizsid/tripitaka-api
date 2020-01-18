import { Request, Response } from 'express';
import { Controller, Get, Middleware } from '@overnightjs/core';
import { checkLocale } from '../middlewares/checkLocale';
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

@Controller('menu')
export class MenuController {

    private getMenu(locale: string): IMenuWithChilds[] {

        const menuBuf = fs.readFileSync(path.join('./src/data/auto/', locale, 'menu.json'));

        const menu: IMenuWithChilds[] = JSON.parse(menuBuf.toString());

        return menu;
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

    @Get(':locale/:menuId')
    @Middleware(checkLocale)
    private showSubMenu(req: Request, res: Response) {
        const menuId = req.params.menuId;

        const splited = menuId.split('_');

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
                id: menu[number - 1].id,
                parent: true,
                childCount: menu[number - 1].childs.length,
            };

            menu = menu[number - 1].childs;

        }

        const filteredChilds: IMenu[] = menu.map((menuItem) => ({
            id: menuItem.id,
            name: menuItem.name,
            parent: typeof menuItem.childs !== 'undefined',
            childCount: typeof menuItem.childs !== 'undefined' ? menuItem.childs.length : 0,
        }));

        res.status(200).json({
            status: true,
            data: { ...parent, childs: filteredChilds },
        });
    }
}
