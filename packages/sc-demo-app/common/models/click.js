'use strict';

module.exports = function(Click) {
  Click.click = (address, cb) => {
    return Click.app.models.GlobalClick.click(address, cb);
  };

  Click.remoteMethod('click', {
    isStatic: true,
    accepts: [
      {
        arg: 'address',
        description: 'Address of the deployed contract',
        type: 'string',
        http: {source: 'path'},
        required: true,
      },
    ],
    http: {
      verb: 'post',
      path: '/:address',
    },
  });

  // eth_sign calculated the signature over keccak256("\x19Ethereum Signed Message:\n" + len(givenMessage) + givenMessage)))
  // this gives context to a signature and prevents signing of transactions.
  function messageHash(web3, msg) {
    return web3.utils.sha3('\x19Ethereum Signed Message:\n' + msg.length + msg);
  }

  Click.signAndClick = (address, account, cb) => {
    const UserClick = Click.app.models.UserClick;
    const connector = UserClick.dataSource.connector;
    const msg = 'CLICK';
    const msgHex = '0x' + Buffer.from(msg).toString('hex');
    connector.sign(msgHex, account, (err, sig) => {
      if (err) return cb && cb(err);

      sig = sig.substr(2); //remove 0x
      const r = '0x' + sig.slice(0, 64);
      const s = '0x' + sig.slice(64, 128);
      const v = '0x' + sig.slice(128, 130);

      var v_decimal = connector.web3.utils.hexToNumber(v);
      if (v_decimal != 27 || v_decimal != 28) {
        v_decimal += 27;
      }
      console.log(v, v_decimal);

      const hashForVerify = messageHash(connector.web3, msg);
      UserClick.click(
        address,
        account || connector.defaultAccount,
        hashForVerify,
        r,
        s,
        v_decimal,
        cb,
      );
    });
  };

  Click.remoteMethod('signAndClick', {
    isStatic: true,
    accepts: [
      {
        arg: 'address',
        description: 'Address of the deployed contract',
        type: 'string',
        http: {source: 'path'},
        required: true,
      },
      {
        arg: 'account',
        description: 'Address of the deployed contract',
        type: 'string',
        http: {source: 'query'},
        required: false,
      },
    ],
    returns: [
      // Transaction hash
      {
        arg: 'data',
        type: 'object',
        root: true,
      },
    ],
    http: {
      verb: 'post',
      path: '/:address/signAndClick',
    },
  });
};
