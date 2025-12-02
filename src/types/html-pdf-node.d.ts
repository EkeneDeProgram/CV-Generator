// Declare a module for "html-pdf-node" because it has no official TypeScript types.
// This prevents TypeScript from throwing: 
// "Could not find a declaration file for module 'html-pdf-node'".


declare module "html-pdf-node" {
  // We export "any" because the library does not ship with TypeScript typings.
  // This allows your import to work without type errors:
  //   import pdf from "html-pdf-node";
  const value: any;
  
  export default value;
}
