import * as connect from 'connect';
import * as express from 'express';
import * as restify from 'restify';
import * as https from 'https';
import * as http from 'http';
import * as Logger from 'bunyan';

export type RequestHandler = connect.NextHandleFunction | express.RequestHandler | restify.RequestHandler;
export type TApp = connect.Server | http.Server | https.Server | restify.Server;

export type Model = {
    create?: RequestHandler, read?: RequestHandler,
    update?: RequestHandler, del?: RequestHandler
} | {} | any;

// ^ Could have more than CRUD names, but this is better than `any` or `{}`

interface IRoutes {
    routes?: Map<string, Model> | {};
    route?: Map<string, Model> | {};
    admin?: Map<string, Model> | {};
}

export interface IRoutesMergerConfig {
    routes: /*IRoutes | IAdminRoutes | (IRoutes & IAdminRoutes) -- ts: is failing :(*/ IRoutes;

    server_type: 'connect' | 'http' | 'https' | 'express' | 'restify';
    app?: TApp;

    package_: {version: number};
    app_name: string;
    createServerArgs?: restify.ServerOptions | https.ServerOptions;
    root?: string;
    listen_port?: number;
    skip_app_logging?: boolean;
    skip_start_app?: boolean;
    skip_app_version_routes?: boolean;
    skip_use?: boolean;
    version_routes_kwargs?: {};
    logger?: Logger;
    with_app?: (app: TApp) => TApp;

    onServerStart?: (uri: string, app: TApp, next) => void;
    callback?: (err: Error, app?: TApp) => void;
}

export declare const routesMerger: (options?: IRoutesMergerConfig) => void | TApp;
