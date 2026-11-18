Cookie Consent project

A lightweight cookie consent banner and preferences dialog written in plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.

Visitors choose which categories of cookies to allow. Scripts for analytics, marketing and preferences stay blocked until the visitor agrees and the choice is remembered.

Project structure

```
cookie-consent-project/
├── index.html    Page markup, banner and settings dialog
├── styles.css    Design tokens, demo page, banner, dialog and button styles
├── consent.js    The reusable CookieConsent library
├── main.js       Demo wiring (shows consent status on the page)
└── README.md
```

`consent.js` and `styles.css` are what you reuse on a real site. `main.js` only drives the demo page and can be deleted.

Running the project

1. Clone repository 
``` git clone https://github.com/drake-gif/mini-projects/ ``` ## To get both repositories ( 1. cookie consent project
                                                                                            2. age calculator project )

Serve the folder locally. Do not just double-click `index.html`: browsers such as Chrome often refuse to save cookies on `file://` pages, so the banner would reappear on every reload.

Python

```bash
python3 -m http.server 8000
```

On Windows use `python -m http.server 8000`, then open http://localhost:8000.

Node

```bash
npx serve
```

VS Code

Install the "Live Server" extension, right-click `index.html` and choose "Open with Live Server".

Checking that it works

1. The banner appears at the bottom left on first load.
2. Click **Choose**, switch a category on and click **Save choices**. The "Current consent" table updates.
3. Reload the page. The banner stays hidden because the choice was remembered.
4. Click **Clear choice** to remove the cookie and bring the banner back. You can also inspect the `cookie_consent` cookie in DevTools under Application → Cookies.
