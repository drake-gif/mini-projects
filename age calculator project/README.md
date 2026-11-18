Age Calculator project

A small, simple to run web app that calculates your exact age from a date of birth. Enter a birth date and it shows your age in years, months and days, how long until your next birthday and your age expressed in months, weeks, days, hours, minutes and seconds.

Project structure

```
age-calculator-project/
├── index.html   # Page structure and form
├── style.css    # Styling
├── script.js    # Age calculation and results rendering
└── README.md
```

Getting started

No build step or installation is needed.

1. Clone repository 
``` git clone https://github.com/drake-gif/age-calculator-project.git ```

2. Keep `index.html`, `style.css` and `script.js` in the same folder.
3. Open `index.html` in any modern browser.

To serve it locally instead, run this from the project folder and open http://localhost:8000:

```bash
python3 -m http.server 8000
```

## How to use

1. Type/Pick your **Date of birth**.
2. Optionally change **Age on** to calculate your age as of a different date.
3. Select **Calculate age**. Results also update automatically when either date changes.
4. **Clear** to reset the form.

