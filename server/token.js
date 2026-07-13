/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

var crypto = require('crypto');

var randomInt = Math.floor(Math.random() * 0xFFFFFFFF);

const VERSION = "001";
const VERSION_LENGTH = 3;

const APP_ID_LENGTH = 24;

privileges = {
    PrivPublishStream: 0,

    // not exported, do not use directly
    privPublishAudioStream: 1,
    privPublishVideoStream: 2,
    privPublishDataStream: 3,

    PrivSubscribeStream: 4,
};


module.exports.privileges = privileges;

// Initializes token struct by required parameters.
var AccessToken = function (appID, appKey, roomID, userID) {
    let token = this;
    this.appID = appID;
    this.appKey = appKey;
    this.roomID = roomID;
    this.userID = userID;
    this.issuedAt = Math.floor(new Date() / 1000);
    this.nonce = randomInt;
    this.expireAt = 0;
    this.privileges = {};

    // AddPrivilege adds permission for token with an expiration.
    this.addPrivilege = function (privilege, expireTimestamp) {
        if (token.privileges === undefined) {
            token.privileges = {}
        }
        token.privileges[privilege] = expireTimestamp;

        if (privilege === privileges.PrivPublishStream) {
            token.privileges[privileges.privPublishVideoStream] = expireTimestamp;
            token.privileges[privileges.privPublishAudioStream] = expireTimestamp;
            token.privileges[privileges.privPublishDataStream] = expireTimestamp;
        }
    };

    // ExpireTime sets token expire time, won't expire by default.
    // The token will be invalid after expireTime no matter what privilege's expireTime is.
    this.expireTime = function (expireTimestamp) {
        token.expireAt = expireTimestamp;
    };

    this.packMsg = function () {
        var bufM = new ByteBuf();
        bufM.putUint32(token.nonce);
        bufM.putUint32(token.issuedAt);
        bufM.putUint32(token.expireAt);
        bufM.putString(token.roomID);
        bufM.putString(token.userID);
        bufM.putTreeMapUInt32(token.privileges);
        return bufM.pack()
    };

    // Serialize generates the token string
    this.serialize = function () {
        var bytesM = this.packMsg();

        var signature = encodeHMac(token.appKey, bytesM);
        var content = new ByteBuf().putBytes(bytesM).putBytes(signature).pack();

        return (VERSION + token.appID + content.toString('base64'));
    };

    // Verify checks if this token valid, called by server side.
    this.verify = function (key) {
        if (token.expireAt > 0 && Math.floor(new Date() / 1000) > token.expireAt) {
            return false
        }

        token.appKey = key;
        return encodeHMac(token.appKey, this.packMsg()).toString() === token.signature;
    }

};

// Parse retrieves token information from raw string
var Parse = function (raw) {
    try {
        if (raw.length <= VERSION_LENGTH + APP_ID_LENGTH) {
            return
        }
        if (raw.substr(0, VERSION_LENGTH) !== VERSION) {
            return
        }
        var token = new AccessToken("", "", "", "");
        token.appID = raw.substr(VERSION_LENGTH, APP_ID_LENGTH);

        var contentBuf = Buffer.from(raw.substr(VERSION_LENGTH + APP_ID_LENGTH), 'base64');
        var readbuf = new ReadByteBuf(contentBuf);

        var msg = readbuf.getString();
        token.signature = readbuf.getString().toString();

        // parse msg
        var msgBuf = new ReadByteBuf(msg);
        token.nonce = msgBuf.getUint32();
        token.issuedAt = msgBuf.getUint32();
        token.expireAt = msgBuf.getUint32();
        token.roomID = msgBuf.getString().toString();
        token.userID = msgBuf.getString().toString();
        token.privileges = msgBuf.getTreeMapUInt32();

        return token
    } catch (err) {
        console.log(err);
    }
};


module.exports.version = VERSION;
module.exports.AccessToken = AccessToken;
module.exports.Parse = Parse;

var encodeHMac = function (key, message) {
    return crypto.createHmac('sha256', key).update(message).digest();
};

var ByteBuf = function () {
    var that = {
        buffer: Buffer.alloc(1024)
        , position: 0
    };


    that.pack = function () {
        var out = Buffer.alloc(that.position);
        that.buffer.copy(out, 0, 0, out.length);
        return out;
    };

    that.putUint16 = function (v) {
        that.buffer.writeUInt16LE(v, that.position);
        that.position += 2;
        return that;
    };

    that.putUint32 = function (v) {
        that.buffer.writeUInt32LE(v, that.position);
        that.position += 4;
        return that;
    };

    that.putBytes = function (bytes) {
        that.putUint16(bytes.length);
        bytes.copy(that.buffer, that.position);
        that.position += bytes.length;
        return that;
    };

    that.putString = function (str) {
        return that.putBytes(Buffer.from(str));
    };

    that.putTreeMap = function (map) {
        if (!map) {
            that.putUint16(0);
            return that;
        }

        that.putUint16(Object.keys(map).length);
        for (var key in map) {
            that.putUint16(key);
            that.putString(map[key]);
        }

        return that;
    };

    that.putTreeMapUInt32 = function (map) {
        if (!map) {
            that.putUint16(0);
            return that;
        }

        that.putUint16(Object.keys(map).length);
        for (var key in map) {
            that.putUint16(key);
            that.putUint32(map[key]);
        }

        return that;
    };

    return that;
};

var ReadByteBuf = function (bytes) {
    var that = {
        buffer: bytes
        , position: 0
    };

    that.getUint16 = function () {
        var ret = that.buffer.readUInt16LE(that.position);
        that.position += 2;
        return ret;
    };

    that.getUint32 = function () {
        var ret = that.buffer.readUInt32LE(that.position);
        that.position += 4;
        return ret;
    };

    that.getString = function () {
        var len = that.getUint16();

        var out = Buffer.alloc(len);
        that.buffer.copy(out, 0, that.position, (that.position + len));
        that.position += len;
        return out;
    };

    that.getTreeMapUInt32 = function () {
        var map = {};
        var len = that.getUint16();
        for (var i = 0; i < len; i++) {
            var key = that.getUint16();
            var value = that.getUint32();
            map[key] = value;
        }
        return map;
    };

    return that;
};
