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

    find -type f -not -name "*.ts" -and -not -path "./.git/*" -and -not -path "./node-modules/*" -and -not -name '*.map' | cpio -pdamv ../routes-merger-dist

Or just a simple:

    cp -r {*.md,*.js*} ../routes-merger-dist

## Future work

  - Finish implementing Express, Connect and generic
  - Tests
