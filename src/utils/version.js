// src/utils/versions.js
import appPkg  from '../../package.json';                      // version du portfolio
import ltdsPkg from '@tarik-leviathan/ltds/package.json';      // version de l’usine (dep NPM)

export const portfolioVersion = appPkg.version;
export const ldsVersion       = ltdsPkg.version; // (si ton scope c’est @tarik-leviathan/ltds)
