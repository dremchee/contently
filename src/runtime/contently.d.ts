export type CurtomRouterMeta = {
  header?: {
    title?: string;
  };
};

declare module "#vue-router" {
  interface RouteMeta extends CurtomRouterMeta {}
}
