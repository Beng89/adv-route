import * as express from "express";

/**
 * Callback for an app creation method
 */
export interface AppCallback {
  (err?: Error, app?: express.Application): void;
}

/**
 * Callback for a router creation method
 */
export interface RouterCallback {
  (err?: Error, app?: express.Router)
}

/**
 * A route that can be mounted to an express application or router
 */
export class Route {
  /**
   * The route method (ie. GET)
   */
  method: string;
  /**
   * The route path (ie. /myapi/v1/something/awesome)
   */
  path: string;
  /**
   * The path to the controller relative to process.cwd() (ie. controllers/something)
   */
  controller: string;
  /**
   * The name of the method to call on the controller (ie. awesome)
   * - Note that this is optional and if it is not provided, the controller will be called directly
   */
  target: string;
  
  /**
   * Mounts this route on the router or application
   */
  mount(mountTo: express.Router|express.Application): void;
}

/**
 * Parses the specified file into an array of routes
 */
export function fileParser(path: string): Array<Route>;

/**
 * Parses the string into a route
 */
export function routeParser(string: string): Route;

/**
 * Crates an express Application from the provided file
 */
export function createExpressApp(path: string, cb: AppCallback): void;

/**
 * Creates an express Router from the provided file
 */
export function createExpressRouter(path: string, cb: RouterCallback): void;