
/** @type Egg.EggPlugin */
// module.exports = {
// had enabled by egg
// static: {
//   enable: true,
// }
// };
import 'tsconfig-paths/register';

export const mysql = {
    enable: true,
    package: 'egg-mysql'
}
export const cors = {
    enable: true,
    package: 'egg-cors'
}
