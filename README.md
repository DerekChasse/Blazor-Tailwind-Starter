# About
This is a starter project which combines a Blazor WebAssembly with Tailwind CSS.  This is not quite a trival exercise as Tailwind is largely dependant on the `npm` ecosystem while Blazor, quite famously, is not.

## Prerequisites

A devcontainer definition is included in the repo, so you can take advantage of developing using VSCode within a docker container.  This is the recommended method of using this repo, at least until you are ready to proceed.


- https://code.visualstudio.com/docs/remote/containers
- https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers



## Build
`dotnet build` will build and bundle all the of the Tailwind CSS and will also bundle 3rd party vendor specific javascript defined within the `gulpfile`.

`dotnet build -c Release` will do the same, but will minify css, prune Tailwind CSS to only include classes used in the `html` and `razor` files, and uglify the bundled javascript.

## References and thanks
- https://chrissainty.com/integrating-tailwind-css-with-blazor-using-gulp-part-1/
- https://codewithmukesh.com/blog/integrating-tailwind-css-with-blazor/
