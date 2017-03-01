# express-race
run express/connect middleware in parallel, proceeding when first completes or when all middlewares have errored.

##Usage

```js
var race = require('express-race');

app.use(race(middleware1, middleware1);
```
