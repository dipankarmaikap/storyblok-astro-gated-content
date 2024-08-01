/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/studio-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
interface Window {
  htmx: any; // or you can use a more specific type if available
}
