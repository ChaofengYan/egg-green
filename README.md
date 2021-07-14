# egg-green

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-green.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-green
[travis-image]: https://img.shields.io/travis/eggjs/egg-green.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-green
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-green.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-green?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-green.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-green
[snyk-image]: https://snyk.io/test/npm/egg-green/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-green
[download-image]: https://img.shields.io/npm/dm/egg-green.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-green

<!--
Description here.
-->

## 安装

```bash
$ npm i egg-green --save
```

## 使用

```js
// {app_root}/config/plugin.js
exports.green = {
  enable: true,
  package: 'egg-green',
};
```

在`ctx`上挂载`green`变量，通过`ctx.green[类型][方法](参数)`使用，其中`类型`有`text`、`image`、`video`、`file`和`voice` 5种，`方法`可参考[阿里云内容安全产品文档](https://help.aliyun.com/product/28415.html)

```js
module.exports = class extends Controller {
  async textScan() {
    const ctx = this.ctx;
    
     ctx.body = = await ctx.green.text.scan({
      bizType: 'homon',
      scenes: [ 'antispam' ],
      tasks,
    });
  }
};
```

## 配置

```js
// {app_root}/config/config.default.js
exports.green = {
  accessKeyId: 'your access key',  // 必选
  accessKeySecret: 'your access secret', // 必选
  endpoint: 'http://green.cn-shanghai.aliyuncs.com' // 可选
  bizType: 'xx', // 业务场景，在「阿里云控制台 -> 内容安全 -> 设置 -> 内容检测API」中查看或新增
};
```

## License

[MIT](LICENSE)
