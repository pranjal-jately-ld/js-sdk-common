const utils = require('./utils');

function FlagStore() {
  let flags = {};
  let flagOverrides;

  function get(key) {
    // Check overrides first, then real flags
    if (flagOverrides && utils.objectHasOwnProperty(flagOverrides, key) && flagOverrides[key]) {
      return flagOverrides[key];
    }

    if (flags && utils.objectHasOwnProperty(flags, key) && flags[key] && !flags[key].deleted) {
      return flags[key];
    }

    return null;
  }

  function getFlagsWithOverrides() {
    const result = {};

    // Add all flags first
    for (const key in flags) {
      const flag = get(key);
      if (flag) {
        result[key] = flag;
      }
    }

    // Override with any flagOverrides (they take precedence)
    if (flagOverrides) {
      for (const key in flagOverrides) {
        const override = get(key);
        if (override) {
          result[key] = override;
        }
      }
    }

    return result;
  }

  function setFlags(newFlags) {
    flags = { ...newFlags };
  }

  function setOverride(key, value) {
    if (!flagOverrides) {
      flagOverrides = {};
    }
    flagOverrides[key] = { value };
  }

  function removeOverride(key) {
    if (!flagOverrides || !flagOverrides[key]) {
      return; // No override to remove
    }

    delete flagOverrides[key];

    // If no more overrides, reset to undefined for performance
    if (Object.keys(flagOverrides).length === 0) {
      flagOverrides = undefined;
    }
  }

  function clearAllOverrides() {
    if (!flagOverrides) {
      return {}; // No overrides to clear, return empty object for consistency
    }

    const clearedOverrides = { ...flagOverrides };
    flagOverrides = undefined; // Reset to undefined
    return clearedOverrides;
  }

  function getFlags() {
    return flags;
  }

  function getFlagOverrides() {
    return flagOverrides || {};
  }

  return {
    clearAllOverrides,
    get,
    getFlagOverrides,
    getFlags,
    getFlagsWithOverrides,
    removeOverride,
    setFlags,
    setOverride,
  };
}

module.exports = FlagStore;
