# Find My Next Car (prototype)

Enter a Dutch number plate and see three newer cars launched in the Netherlands since mid 2025 that are a real step forward from your current car, each from a different brand than yours.

**Preview only.** Prices are Dutch list prices as of November 2026 and are a guide only. The plate is sent only to the RDW's public open data service to look up the car. It is not stored or logged.

## Build

`index.html` is the built page. To rebuild it from source:

```
python3 build.py
```

This puts `engine.js` and `next.js` into `template.html` and writes `find-my-next-car.html` and `index.html`. `test.js` (needs Node.js) runs nine example owner profiles through the matching.
