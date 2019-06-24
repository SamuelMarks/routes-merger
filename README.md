routes-merger
=============

Generic--connect, restify, express--function to merge routes from a Map.

Supported 'servers':

 - [restify](https://github.com/restify/node-restify)
 
WiP:

 - [connect](https://github.com/senchalabs/connect)
 - [Express](https://github.com/expressjs/express)
 - [http](https://nodejs.org/api/http.html) (Node.JS)
 - [https](https://nodejs.org/api/https.html) (Node.JS)
 
## Usage

    import { routesMerger } from 'routes-merger';

    routesMerger(/*IRoutesMergerConfig*/);

Some other file:

    export const getUser = (app: restify.Server, namespace: string = ''): void =>
        app.get(namespace, (req: restify.Request, res: restify.Response, next: restify.Next) => {
             req.send(200, 'I am user');
             return next();
        };

## Configuration

See `IroutesMwConfig` interface in [routes-merger.d.ts](https://github.com/SamuelMarks/routes-merger).

## Extending

Adding a new server? - Expand the `IroutesMwConfig` interface, and add a new short-function that implements it. See others for reference.

### Development setup
Install the latest Node.JS, `npm i -g typings typescript`, then:

    git clone https://github.com/SamuelMarks/routes-merger
    git clone https://github.com/SamuelMarks/routes-merger-dist
    cd routes-merger
    typings i
    npm i
    npm test

Update [routes-merger-dist](https://github.com/SamuelMarks/routes-merger-dist):

    dst="${PWD##*/}"-dist;
    find -type f -not -path './node_modules*' -a -not -path './.git*' -a -not -path './.idea*' -a -not -path './typings*' -a -not -name '*.ts' -not -name 'ts*' | cpio -pdamv ../"$dst";

Or just a simple:

    cp -r {*.md,*.js*} ../routes-merger-dist

## Future work

  - Finish implementing Express, Connect and generic
  - Tests

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <https://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
