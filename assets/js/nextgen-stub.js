/** Stub local NextGen: Turnstile satisfeito, sem contato externo. */
window.turnstile = window.turnstile || {
  render: function (_el, opts) { setTimeout(function () { opts && opts.callback && opts.callback("NG-ok-" + Date.now()); }, 10); return { reset: function () {}, remove: function () {} }; },
  reset: function () {},
  remove: function () {},
  getResponse: function () { return "NG-ok-" + Date.now(); }
};