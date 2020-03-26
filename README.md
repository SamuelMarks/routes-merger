routes-merger
=============
[![License](https://img.shields.io/badge/license-Apache--2.0%20OR%20MIT-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![npm](https://img.shields.io/npm/v/@offscale/routes-merger)
![David dependency status for latest release](https://david-dm.org/SamuelMarks/routes-merger.svg)
![npm-publish](https://github.com/SamuelMarks/routes-merger/workflows/npm-publish/badge.svg)


Generic—connect, restify, express—function to merge routes from a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

Supported 'servers':

 - [restify](https://github.com/restify/node-restify)
 
WiP:

 - [connect](https://github.com/senchalabs/connect)
 - [Express](https://github.com/expressjs/express)
 - [http](https://nodejs.org/api/http.html) (Node.JS)
 - [https](https://nodejs.org/api/https.html) (Node.JS)

## Install

    npm i -S @offscale/routes-merger

## Usage
```ts
import { routesMerger } from '@offscale/routes-merger';

routesMerger(/*IRoutesMergerConfig*/);
```

Some other file:
```ts
export const getUser = (app: restify.Server, namespace: string = ''): void =>
    app.get(namespace, (req: restify.Request, res: restify.Response, next: restify.Next) => {
         req.send(200, 'I am user');
         return next();
    };
```

## Configuration

See [`IRoutesMwConfig` interface](interfaces.d.ts).

## Extending

Adding a new server? - Expand the `IRoutesMwConfig` interface, and add a new short-function that implements it. See others for reference.

## Future work

  - Finish implementing Express, Connect and generic
  - Tests

---

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <https://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
