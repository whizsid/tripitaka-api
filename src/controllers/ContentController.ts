import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

@Controller('content')
export class ContentController {

    @Get('/')
    private showMainMenu(req: Request, res: Response) {
        res.status(200).json([
            {
                name: 'Diga Nikaya',
            },
        ]);
    }

    @Get(':mainMenu')
    private showSubMenu(req: Request, res: Response) {
        const mainMenu = req.params.mainMenu;

        res.status(200).json({
            name: mainMenu,
        });
    }

    @Get(':mainMenu/:subMenu')
    private showChapterList(req: Request, res: Response) {
        const mainMenu = req.params.mainMenu;

        const subMenu = req.params.subMenu;

        res.status(200).json({
            mainMenu,
            subMenu,
        });
    }
}
