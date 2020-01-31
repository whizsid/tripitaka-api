# tripitaka-api
This is a self-hosting tripitaka API server. You can use this server for your tripitaka applications.

## Roadpath

- [ ] Implementing full tripitaka
- [ ] Translating to all locales

## Documentation

Use your browser or post mant to access these URLs. You can get a JSON result after a successful call.

### Getting menu Items

We can get the main menu items by accessing below URL.

```
Request:-
http://localhost:5000/menu/si_LK
// si_LK is the locale code

Response:-
{
    status: true,
    data: [
        {
            id: "p1",
            name: "විනයපිටක",
            parent: true,
            childCount: 5
        },
        ...
    ]
}
```

And please provide a path to access nested menus.

```
Request:-
http://localhost:5000/v1/menu/si_LK/p2/n2
// p2 and n2 are parent ids

Response:- 
{
    status: true,
    data: {
        name: "මජ්ඣිමනිකාය",
        id: "n2",
        parent: true,
        childCount: 3,
        childs: [
            {
                id: "b1",
                name: "මූලපණ්ණාසපාළි",
                parent: true,
                childCount: 5
            },
            ...
        ]
    }
}

```

### Getting Sutta contents

Please access below URL with your path to get the sutta contents.

```
Request:-
http://localhost:5000/v1/sutta/si_LK/p2/n2/b2/v2

Response:-
{
    id: "p2_n2_b2_v2",
    title: "භික්ඛුවග්ගො",
    sections: [
        {
            title: "1. අම්බලට්ඨික රාහුලොවාද සූත්‍රය",
            id: "p2_n2_b2_v2_s1",
            paragraphs: [
                {
                    number: "107",
                    content: "මා විසින් මෙසේ...",
                    id: "p2_n2_b2_v2_s1_p1"
                },
                ...
            ],
            endingText: "පළමුවෙනිවූ අම්බලට්ඨික රාහුලොවාද සූත්‍රය නිමි. (2-1)"
        },
        ...
    ]
}

```

## Locales

- [x] Sinhala
- [ ] English

## Adding locales

Use [POEdit](https://poedit.net/) application to edit or create your translation files. Put your translation files in `/data/locales/translations/<path-to-sutta>` folder. 

## Testing

1. Install depedencies. `npm install`
2. Compile translation files. `npm run translate`
3. Watch your changes. `npm run start-dev` 

## Contributions

All contributions are welcome. Please help us to add your language to the above list and spread tripitaka.

