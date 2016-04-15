import * as express from "express";
export declare function createExpressApp(path: string, cb: Function): void;
export declare function createExpressAppAsync(path: string): Promise<express.Express>;
export declare function createExpressRouter(path: string, cb: Function): void;
export declare function createExpressRouterAsync(path: string): Promise<express.Router>;
export declare function parseFile(path: string): Promise<Route[]>;
export declare function parseRoute(str: string): Route;
export declare class Route {
    constructor(method: string, path: string, controller: string, target?: string);
    method: string;
    path: string;
    controller: string;
    target: string;
    mount(router: express.Router): void;
}
