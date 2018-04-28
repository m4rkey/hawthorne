// Generated by CoffeeScript 2.1.1
(function() {
  fermata.registerPlugin('hawpi', function(transport, base) {
    // I know the name is fcking clever
    this.base = base;
    return function(request, callback) {
      // the rest is "borrowed" from the built-in JSON plugin
      request.headers['Accept'] = 'application/json';
      request.headers['Content-Type'] = 'application/json';
      request.data = JSON.stringify(request.data);
      return transport(request, function(err, response) {
        var e, skip, target;
        if (!err) {
          if (response.status.toFixed()[0] !== '2') {
            err = Error('Bad status code from server: ' + response.status);
          }
          try {
            response = JSON.parse(response.data);
          } catch (error) {
            e = error;
            err = e;
          }
        }
        target = request.options.target;
        skip = request.options.skip_animation;
        if (target) {
          if (!err && !skip) {
            window.style.submit.state(target, true);
          }
          if (err && !skip) {
            window.style.submit.state(target, false);
          }
          if (err || !response.success) {
            window.style.card(true, response.reason);
          }
        }
        callback(err, response);
        if (request.options.target) {
          setTimeout(function() {
            window.style.submit.clear(target);
            if (err) {
              return window.style.card(false);
            }
          }, 2400);
        }
      });
    };
  });

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  var insertHtml;

  insertHtml = function(value, position, nodes) {
    return nodes.forEach(function(item) {
      var e, results, tmpnode, tmpnodes;
      tmpnodes = document.createElement('div');
      tmpnodes.innerHTML = value;
      results = [];
      while ((tmpnode = tmpnodes.lastChild) !== null) {
        try {
          if (position === 'before') {
            results.push(item.parentNode.insertBefore(tmpnode, item));
          } else if (position === 'after') {
            results.push(item.parentNode.insertBefore(tmpnode, item.nextSibling));
          } else if (position === 'append') {
            results.push(item.appendChild(tmpnode));
          } else if (position === 'prepend') {
            results.push(item.insertBefore(tmpnode, item.firstChild));
          } else {
            results.push(void 0);
          }
        } catch (error) {
          e = error;
          break;
        }
      }
      return results;
    });
  };

  $.fn.hasClass = function(className) {
    return !!this[0] && this[0].classList.contains(className);
  };

  $.fn.addClass = function(className) {
    this.forEach(function(item) {
      var classList;
      classList = item.classList;
      return classList.add.apply(classList, className.split(/\s/));
    });
    return this;
  };

  $.fn.removeClass = function(className) {
    this.forEach(function(item) {
      var classList;
      classList = item.classList;
      return classList.remove.apply(classList, className.split(/\s/));
    });
    return this;
  };

  $.fn.toggleClass = function(className, b) {
    this.forEach(function(item) {
      var classList;
      classList = item.classList;
      if (typeof b !== 'boolean') {
        b = !classList.contains(className);
      }
      classList[b ? 'add' : 'remove'].apply(classList, className.split(/\s/));
    });
    return this;
  };

  $.fn.css = function(property, value = null) {
    if (value === null) {
      console.log('this is not yet implemented');
    } else {
      this.forEach(function(item) {
        var e;
        try {
          return item.style[property] = value;
        } catch (error) {
          e = error;
          return console.error('Could not set css style property "' + property + '".');
        }
      });
    }
    return this;
  };

  $.fn.remove = function() {
    this.forEach(function(item) {
      return item.parentNode.removeChild(item);
    });
    return this;
  };

  $.fn.val = function(value = '') {
    if (value !== '') {
      this.forEach(function(item) {
        return item.value = value;
      });
    } else if (this[0]) {
      return this[0].value;
    }
    return this;
  };

  $.fn.html = function(value = null) {
    if (value !== null) {
      this.forEach(function(item) {
        return item.innerHTML = value;
      });
    }
    if (this[0]) {
      return this[0].innerHTML;
    }
    return this;
  };

  $.fn.htmlBefore = function(value) {
    insertHtml(value, 'before', this);
    return this;
  };

  $.fn.htmlAfter = function(value) {
    insertHtml(value, 'after', this);
    return this;
  };

  $.fn.htmlAppend = function(value) {
    insertHtml(value, 'append', this);
    return this;
  };

  $.fn.htmlPrepend = function(value) {
    insertHtml(value, 'prepend', this);
    return this;
  };

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  // original code from davesag
  // http://jsfiddle.net/davesag/qgCrk/6/
  var DatetoISO8601, parseDuration, toDurationString, to_seconds;

  to_seconds = function(dd, hh, mm) {
    var d, h, m, t;
    d = parseInt(dd);
    h = parseInt(hh);
    m = parseInt(mm);
    if (d == null) {
      d = 0;
    }
    if (h == null) {
      h = 0;
    }
    if (m == null) {
      m = 0;
    }
    // if (isNaN(d)) d = 0
    // if (isNaN(h)) h = 0
    // if (isNaN(m)) m = 0
    t = d * 24 * 60 * 60 + h * 60 * 60 + m * 60;
    return t;
  };

  // expects 1d 11h 11m, or 1d 11h,
  // or 11h 11m, or 11h, or 11m, or 1d
  // returns a number of seconds.
  parseDuration = function(sDuration) {
    var days, drx, hours, hrx, minutes, morx, mrx, wrx, yrx;
    if (sDuration === null || sDuration === '') {
      return 0;
    }
    mrx = new RegExp(/([0-9][0-9]?)[ ]?m(?:[^o]|$)/);
    hrx = new RegExp(/([0-9][0-9]?)[ ]?h/);
    drx = new RegExp(/([0-9]{1,2})[ ]?d/);
    wrx = new RegExp(/([0-9][0-9]?)[ ]?w/);
    morx = new RegExp(/([0-9][0-9]?)[ ]?mo/);
    yrx = new RegExp(/([0-9][0-9]?)[ ]?y/);
    days = 0;
    hours = 0;
    minutes = 0;
    if (morx.test(sDuration)) {
      days += morx.exec(sDuration)[1] * 31;
    }
    if (mrx.test(sDuration)) {
      minutes = mrx.exec(sDuration)[1];
    }
    if (hrx.test(sDuration)) {
      hours = hrx.exec(sDuration)[1];
    }
    if (drx.test(sDuration)) {
      days += drx.exec(sDuration)[1];
    }
    if (wrx.test(sDuration)) {
      days += wrx.exec(sDuration)[1] * 7;
    }
    if (yrx.test(sDuration)) {
      days += yrx.exec(sDuration)[1] * 365;
    }
    return to_seconds(days, hours, minutes);
  };

  // outputs a duration string based on
  // the number of seconds provided.
  // rounded off to the nearest 1 minute.
  toDurationString = function(iDuration) {
    var d, h, m, result;
    if (iDuration <= 0) {
      return '';
    }
    m = Math.floor((iDuration / 60) % 60);
    h = Math.floor((iDuration / 3600) % 24);
    d = Math.floor(iDuration / 86400);
    result = '';
    if (d > 0) {
      result = result + d + 'd ';
    }
    if (h > 0) {
      result = result + h + 'h ';
    }
    if (m > 0) {
      result = result + m + 'm ';
    }
    return result.substring(0, result.length - 1);
  };

  DatetoISO8601 = function(obj) {
    var date, hours, minutes, month, year;
    year = obj.getFullYear();
    month = obj.getMonth().toString().length === 1 ? '0' + (obj.getMonth() + 1).toString() : obj.getMonth() + 1;
    date = obj.getDate().toString().length === 1 ? '0' + obj.getDate().toString() : obj.getDate();
    hours = obj.getHours().toString().length === 1 ? '0' + obj.getHours().toString() : obj.getHours();
    minutes = obj.getMinutes().toString().length === 1 ? '0' + obj.getMinutes().toString() : obj.getMinutes();
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  window.style.duration = {
    parse: parseDuration,
    string: toDurationString
  };

  window.style.getOrCreate('utils').date = {
    convert: {
      to: {
        iso: DatetoISO8601
      }
    }
  };

}).call(this);
// Generated by CoffeeScript 2.1.1
(function() {
  //= require style.fermata.coffee
  //= require style.ext.coffee
  //= require style.time.coffee
  var InformationCard, InputVerification, copyTextToClipboard, mutegag__toggle, permission__toggle, settings__init, submit__cleanup, submit__state, type__toggle;

  mutegag__toggle = function(that) {
    var i, j, len, ref, results, state;
    ref = that.children;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      state = i.getAttribute('class');
      if (state.match(/gray/)) {
        state = state.replace('gray', '');
        state += 'red selected';
      } else {
        state = state.replace('red', '');
        state = state.replace('selected', '');
        state += 'gray';
      }
      state = state.replace('  ', ' ');
      results.push(i.setAttribute('class', state));
    }
    return results;
  };

  permission__toggle = function(that) {
    var parent;
    parent = that.parentElement;
    $('.perms .permission.collapsed', parent).removeClass('collapsed').addClass('previous');
    $('.perms .permission:not(.previous)', parent).addClass('collapsed');
    $('.perms .permission.previous', parent).removeClass('previous');
    $('svg', that).toggleClass('activated');
    if ($('svg', that).hasClass('activated')) {
      $('span', that).html('Advanced');
    } else {
      $('span', that).html('Simple');
    }
  };

  type__toggle = function(that) {
    var parent, target, toggle;
    parent = that.parentElement;
    target = $('.column.username', parent);
    toggle = $('.choices', target).hasClass('focus');
    if (toggle) {
      $('.choices', target).removeClass('focus');
    } else {
      $('.input-wrapper', target).removeClass('focus');
    }
    setTimeout(function() {
      if (toggle) {
        $('.input-wrapper', target).addClass('focus');
      } else {
        $('.choices', target).addClass('focus');
      }
      return 300;
    });
    $('svg', that).toggleClass('activated');
    if ($('svg', that).hasClass('activated')) {
      return $('span', that).html('Local');
    } else {
      return $('span', that).html('Steam');
    }
  };

  settings__init = function(init = false) {
    $('.permission__child').on('change', function(event) {
      var candidates, cl, i, l, t;
      t = event.target;
      cl = t.classList.value;
      cl = cl.replace('permission__child', '');
      cl = cl.replace(/\s/g, '');
      candidates = $(`.${cl}`);
      l = candidates.length;
      i = 0;
      candidates.forEach(function(item) {
        if (item.checked) {
          return i++;
        }
      });
      if (i === l) {
        $(`#${cl}`)[0].checked = true;
      } else if (i === 0) {
        $(`#${cl}`)[0].checked = false;
      } else {
        $(`#${cl}`)[0].checked = false;
        $(`#${cl} + label svg`).addClass('partially');
      }
      if (i === l || i === 0) {
        return $(`#${cl} + label svg`).removeClass('partially');
      }
    });
    $('.permission__parent').on('change', function(event) {
      var t;
      t = event.target;
      $('label svg', t.parentElement).removeClass('partially');
      if (t.checked) {
        return $(`.permission__child.${t.id}`).forEach(function(i) {
          return i.checked = true;
        });
      } else {
        return $(`.permission__child.${t.id}`).forEach(function(i) {
          return i.checked = false;
        });
      }
    });
    if (init) {
      $('.permission__parent').forEach(function(parent) {
        var candidates;
        candidates = {
          true: 0,
          false: 0
        };
        $(`.permission__child.${parent.id}`).forEach(function(i) {
          return candidates[i.checked] += 1;
        });
        if (candidates[true] === 0) {
          parent.checked = false;
        } else if (candidates[false] === 0) {
          parent.checked = true;
        } else {
          parent.checked = false;
          $("label svg", parent.parentElement).addClass('partially');
        }
      });
    }
  };

  copyTextToClipboard = function(text) {
    var err, msg, successful, textArea;
    textArea = document.createElement('textarea');
    // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      successful = document.execCommand('copy');
      msg = successful ? 'successful' : 'unsuccessful';
    } catch (error) {
      err = error;
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  };

  InputVerification = function(mode, event, that) {
    var character, keycode;
    keycode = void 0;
    if (window.event) {
      keycode = window.event.keyCode;
    } else if (event) {
      keycode = event.which;
    }
    character = String.fromCharCode(event.keyCode);
    switch (mode) {
      case 'single':
        if (keycode === 13) {
          return false;
        }
    }
    return true;
  };

  InformationCard = function(show = true, reason) {
    var output;
    if (show) {
      output = '';
      reason.forEach(function(i) {
        if (typeof i === 'string') {
          return output += `<div class='content'>${i}</div>`;
        } else if (typeof i === 'object') {
          return Object.keys(i).forEach(function(k) {
            return i[k].forEach(function(state) {
              state = state.replace(/of uuid type/g, 'present');
              state = state.replace(/value/g, i[k]);
              if (state.search(k === -1)) {
                state = `${k} ${state}`;
              }
              return output += `<div class='content'>${state}</div>`;
            });
          });
        }
      });
      $('.status-card .info').html(output);
      return $('.status-card').addClass('active');
    } else {
      return $('.status-card').removeClass('active');
    }
  };

  submit__state = function(that, success = true) {
    var animated, target;
    target = $(that);
    animated = false;
    if (target.hasClass('fancy')) {
      animated = true;
    }
    if (success && !target.hasClass('success')) {
      target.addClass('explicit green');
      if (animated) {
        target.addClass('success');
      }
    }
    if (!success && !target.hasClass('fail')) {
      target.addClass('explicit red');
      if (animated) {
        return target.addClass('fail');
      }
    }
  };

  submit__cleanup = function(that) {
    var state;
    state = that.getAttribute('class');
    state = state.replace(/explicit/g, '');
    state = state.replace(/green/g, '');
    state = state.replace(/red/g, '');
    state = state.replace(/fail/g, '');
    state = state.replace(/success/g, '');
    state = state.replace(/(\s+)/g, ' ');
    return that.setAttribute('class', state);
  };

  window.style.getOrCreate('utils').getOrCreate('verify').input = InputVerification;

  window.style.getOrCreate('mutegag').toggle = mutegag__toggle;

  window.style.settings = {
    permissions: permission__toggle,
    type: type__toggle,
    init: settings__init
  };

  window.style.submit = {
    state: submit__state,
    clear: submit__cleanup
  };

  window.style.card = InformationCard;

  window.style.copy = copyTextToClipboard;

  window.endpoint = {
    api: fermata.hawpi("/api/v1"),
    ajax: fermata.raw({
      base: window.location.origin + "/ajax/v1"
    }),
    bare: fermata.raw({
      base: window.location.origin
    })
  };

}).call(this);
