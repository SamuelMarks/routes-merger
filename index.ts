import * as Logger from 'bunyan';
import { createLogger } from 'bunyan';
import * as restify from 'restify';
import { dirname } from 'path';

import { getFunctionParameters } from '@offscale/nodejs-utils';

import { IRoutesMergerConfig, Model, TApp } from './interfaces.d';

const restifyInitApp = (app: restify.Server,
                        with_app: IRoutesMergerConfig['with_app'],
                        skip_app_logging: IRoutesMergerConfig['skip_app_logging'],
                        skip_app_version_routes: IRoutesMergerConfig['skip_app_version_routes'],
                        skip_use: IRoutesMergerConfig['skip_use'],
                        package_: IRoutesMergerConfig['package_'],
                        version_routes_kwargs: IRoutesMergerConfig['version_routes_kwargs']): restify.Server => {
    if (with_app != null)
        app = with_app(app) as restify.Server;

    if (typeof skip_use !== 'boolean' || !skip_use) {
        app.use(restify.plugins.queryParser());
        app.use(restify.plugins.bodyParser());
    }

    if (!skip_app_logging) {
        const event = 'after';
        app.on(event, restify.plugins.auditLogger({
            event, log: Logger.createLogger({
                name: 'audit',
                stream: process.stdout
            })
        }));
    }

    if (!skip_app_version_routes)
        ['/', '/version', '/api', '/api/version']
            .map(route_path =>
                app.get(route_path, (req, res, next) => {
                    res.json(Object.assign({ version: package_.version }, version_routes_kwargs));
                    return next();
                })
            );

    return app;
};

const restifyStartApp = (skip_start_app: IRoutesMergerConfig['skip_start_app'],
                         app: restify.Server,
                         listen_port: IRoutesMergerConfig['listen_port'],
                         onServerStart: IRoutesMergerConfig['onServerStart'],
                         logger: IRoutesMergerConfig['logger'],
                         callback: IRoutesMergerConfig['callback']): void | restify.Server =>
    skip_start_app ? (callback == null ? app : callback(void 0, app))
        : app.listen(listen_port, () => {
            if (logger == null) logger = createLogger({ name: app.name || 'myapp' });
            logger.info('%s listening at %s', app.name, app.url);

            if (onServerStart != null)
                return onServerStart(app.url, app,
                    callback == null ? /* tslint:disable:no-empty*/ () => {} : callback
                );
            else if (callback != null)
                return callback(void 0, app);
            return app;
        });

const handleErr = (callback: (err: Error, res?: TApp) => any) => (e: Error) => {
    if (callback == null) throw e;
    return callback(e);
};

export const routesMerger = (options: IRoutesMergerConfig): TApp | void => {
    ['routes', 'server_type', 'package_', 'app_name'].forEach(opt =>
        options[opt] == null && handleErr(options.callback!)(TypeError(`\`options.${opt}\` required.`))
    );
    if (options.skip_start_app == null) options.skip_start_app = false;
    if (options.skip_app_version_routes == null) options.skip_app_version_routes = false;
    if (options.skip_app_logging == null) options.skip_app_logging = false;
    if (options.logger == null)
        options.logger = Logger.createLogger({
            name: ((options.app
                || { name: '' }) as {name: string}).name
                || options.app_name
                || '@offscale/routes-merger'
        });
    if (options.version_routes_kwargs == null) options.version_routes_kwargs = {};

    // Init server obj
    if (options.app != null) {
        /* tslint:disable:no-empty */
    } else if (options.server_type === 'restify')
        options.app = restifyInitApp(
            options.app == null ? restify.createServer(
                Object.assign({ name: options.app_name }, (options.createServerArgs as restify.ServerOptions) || {})
                )
                : options.app as restify.Server,
            options.with_app, options.skip_app_logging,
            options.skip_app_version_routes, options.skip_use,
            options.package_, options.version_routes_kwargs
        );
    else throw Error(`NotImplemented: ${options.server_type}; TODO`);

    const routes = new Set<string>();
    for (const [dir, program] of options.routes as Map<string, Model>)
        if (['routes', 'route', 'admin'].some(r => dir.indexOf(r) > -1)) {
            let count = 0;
            let error: Error | undefined | unknown;
            Object
                .keys(program)
                .forEach((route: string) => {
                    if (typeof program[route] === 'function'
                        && getFunctionParameters(program[route]).length === 2) {
                        ++count;
                        try {
                            (program[route] as ((app: TApp, namespace: string) => void))(
                                options.app!, `${options.root}/${dirname(dir)}`
                            );
                        } catch (e) {
                            error = e;
                        }
                    }
                });
            if (error != null)
                if (options.callback != null)
                    return options.callback(error as Error);
                else throw error!;

            if (count > 0)
                routes.add(dir);
        }
    options.logger.info(`${options.server_type} registered routes:\t`, Array.from(routes), ';');

    if (options.server_type === 'restify')
        return restifyStartApp(
            options.skip_start_app,
            options.app as restify.Server,
            options.listen_port,
            options.onServerStart,
            options.logger,
            options.callback
        );
    else if (typeof options.callback === 'undefined') return options.app;
    return options.callback(void 0, options.app);
};
