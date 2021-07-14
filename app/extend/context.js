'use strict';

const crypto = require('crypto');
const { v1: uuidV1 } = require('uuid');
const assert = require('assert');

class Green {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.green;
    assert(
      this.config.endpoint,
      "[egg-green] Must set `endpoint` in green's config"
    );
    assert(
      this.config.accessKeySecret && this.config.accessKeyId,
      "[egg-green] Must set `accessKeyId` and `accessKeySecret` in green's config"
    );
    this.clientInfoString = JSON.stringify(this.clientInfo);
  }

  getHeaders(path, data) {
    const {
      accessKeyId,
      accessKeySecret,
      aceVersion,
      acsSignatureVersion,
      acsSignatureMethod,
      clientInfo,
    } = this.config;
    const contentMD5 = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest()
      .toString('base64'),
      date = new Date().toUTCString(),
      aceSignatureNonce = uuidV1();
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-MD5': contentMD5,
      Date: date,
      'x-acs-version': aceVersion,
      'x-acs-signature-nonce': aceSignatureNonce,
      'x-acs-signature-version': acsSignatureVersion,
      'x-acs-signature-method': acsSignatureMethod,
    };
    const signature = [];
    signature.push('POST');
    signature.push('application/json');
    signature.push(contentMD5);
    signature.push('application/json');
    signature.push(date);
    signature.push('x-acs-signature-method:' + acsSignatureMethod);
    signature.push('x-acs-signature-nonce:' + aceSignatureNonce);
    signature.push('x-acs-signature-version:1.0');
    signature.push('x-acs-version:' + aceVersion);
    signature.push(path + '?clientInfo=' + JSON.stringify(clientInfo));
    const authorization = crypto
      .createHmac('sha1', accessKeySecret)
      .update(signature.join('\n'))
      .digest()
      .toString('base64');
    requestHeaders.Authorization = 'acs ' + accessKeyId + ':' + authorization;
    return requestHeaders;
  }

  async request(path, data) {
    const { endpoint, clientInfo, bizType } = this.config;
    if (bizType) data = { bizType, ...data }; // 统一配置业务场景
    const headers = this.getHeaders(path, data);
    path = encodeURI(path + '?clientInfo=' + JSON.stringify(clientInfo));
    return this.ctx.curl(endpoint + path, {
      method: 'POST',
      dataType: 'json',
      data,
      headers,
    });
  }
}

module.exports = {
  get green() {
    const instance = new Green(this);
    const getDomainMethod = domain =>
      new Proxy({}, {
        get(_target, method) {
          return instance.request.bind(
            instance,
            `/green/${domain}/${method}`
          );
        },
      });
    return new Proxy({}, {
      get(_target, domain) {
        return getDomainMethod(domain);
      },
    });
  },
};
