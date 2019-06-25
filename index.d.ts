/// <reference types="node" />
/// <reference types="connect" />
import * as restify from 'restify';
import { IRoutesMergerConfig } from './interfaces.d';
export declare const routesMerger: (options: IRoutesMergerConfig) => void | import("http").Server | import("https").Server | restify.Server | import("connect").Server;
