if (
  typeof __webpack_require__ === 'function' &&
  typeof __webpack_require__.nmd !== 'function'
) {
  // Provide a minimal implementation expected by some UMD/legacy modules
  __webpack_require__.nmd = function (module) {
    // Mark module as non-module-decorated (minimal shim)
    try {
      if (!module) return module;
      module.paths = module.paths || [];
      module.children = module.children || [];
    } catch (e) {}
    return module;
  };
}
