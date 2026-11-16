/// <reference types="vite/client" />

/* Side-effect imports of stylesheets. Vite handles these; TypeScript needs
   to be told they exist. */
declare module "*.scss" {
  const css: string;
  export default css;
}
