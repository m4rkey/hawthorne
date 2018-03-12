// Generated by CoffeeScript 2.1.1
(function() {
  
var cssPath = function(el) {
    if (!(el instanceof Element)) return;
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        if (el.nodeName.toLowerCase() === 'body') {
          return path.join(" > ");
        }

        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
        } else {
            var sib = el, nth = 1;
            while (sib.nodeType === Node.ELEMENT_NODE && (sib = sib.previousSibling) && nth++);
            selector += ":nth-child("+nth+")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}
;
  var edit, group, remove, save, server, submit;

  server = function(query, that = null, selected = '') {
    window.endpoint.api.servers({
      'query': query
    }).get(function(err, data) {
      var ele, fmt, formatted, j, len;
      data = data.result;
      if (that !== null) {
        formatted = [
          {
            'value': 'all',
            'label': '<b>all</b>'
          }
        ];
        if (selected === 'all') {
          formatted[0].selected = true;
        }
        for (j = 0, len = data.length; j < len; j++) {
          ele = data[j];
          fmt = {
            value: ele.id,
            label: ele.name
          };
          if (selected !== '' && fmt.value === selected) {
            fmt.selected = true;
          }
          formatted.push(fmt);
        }
        that.setChoices(formatted, 'value', 'label', true);
      }
      return data;
    });
  };

  group = function(query, that = null, selected = '') {
    window.endpoint.api.roles({
      'query': query
    }).get(function(err, data) {
      var ele, fmt, formatted, j, len;
      data = data['result'];
      if (that !== null) {
        formatted = [];
        for (j = 0, len = data.length; j < len; j++) {
          ele = data[j];
          fmt = {
            value: ele.id,
            label: ele.name,
            customProperties: {
              server: ele.server
            }
          };
          if (selected !== '' && fmt.value === selected) {
            fmt.selected = true;
          }
          formatted.push(fmt);
        }
        that.setChoices(formatted, 'value', 'label', true);
      }
      return data;
    });
  };

  remove = function(mode = '', that) {
    var endpoint, node, payload, role, state, user;
    state = that.getAttribute('class');
    if (!state.match(/confirmation/)) {
      state += ' explicit red confirmation';
      that.setAttribute('class', state);
      return;
    }
    payload = {};
    node = that.parentElement.parentElement.parentElement;
    switch (mode) {
      case 'admin__administrator':
        user = $('input.uuid', node)[0].value;
        role = $('input.role', node)[0].value;
        payload = {
          reset: true,
          role: role
        };
        endpoint = window.endpoint.api.users[user];
        break;
      case 'admin__groups':
        role = $('input.uuid', node)[0].value;
        endpoint = window.endpoint.api.roles[role];
        break;
      case 'ban':
        user = $('input.user', node)[0].value;
        server = $('input.server', node)[0].value;
        console.log($('input.user', node)[0]);
        console.log(user);
        payload = {
          server: server
        };
        endpoint = window.endpoint.api.users[user].ban;
        break;
      case 'mutegag':
        console.log($('input.user', node)[0].value);
        user = $('input.user', node)[0].value;
        server = $('input.server', node)[0].value;
        if (server !== '') {
          payload = {
            server: server
          };
        }
        endpoint = window.endpoint.api.users[user].mutegag;
        break;
      case 'server':
        node = that.parentElement.parentElement.parentElement.parentElement;
        server = $('input.uuid', node)[0].value;
        console.log(server);
        endpoint = window.endpoint.api.servers[server];
        break;
      default:
        return;
    }
    endpoint.delete(payload, function(err, data) {
      if (data.success) {
        return $(node).remove();
      }
    });
  };

  save = function(mode = '', that) {
    var data, j, len, node, now, old, payload, payloads, replacement, role, scope, selector, state, success, time, user, uuid;
    node = that.parentElement.parentElement.parentElement;
    switch (mode) {
      case 'admin__administrator':
        role = $('input.role', node)[0].value;
        uuid = $('input.uuid', node)[0].value;
        selector = window.api.storage[uuid + '#' + role];
        replacement = selector.getValue(true);
        payloads = [
          payload = {
            promotion: false,
            role: role
          },
          payload = {
            promotion: true,
            role: replacement
          }
        ];
        success = 0;
        for (j = 0, len = payloads.length; j < len; j++) {
          payload = payloads[j];
          window.endpoint.api.users[uuid].post(payload, function(err, data) {
            if (!data.success) {
              return;
            }
            return success += 1;
          });
        }
        state = that.getAttribute('class');
        old = state;
        if (success === 2) {
          state += ' explicit red';
        } else {
          state += ' explicit green';
        }
        that.setAttribute('class', state);
        setTimeout(function() {
          return that.setAttribute('class', old);
        }, 1200);
        break;
      case 'admin__groups':
        scope = cssPath(node);
        uuid = $("input.uuid", node)[0].value;
        data = {
          name: $(`${scope} .name span`).html(),
          server: window.api.storage[uuid].getValue(true),
          immunity: parseInt($(`${scope} .immunity span`).html().match(/([0-9]|[1-8][0-9]|9[0-9]|100)(?:%)?$/)[1]),
          usetime: -1,
          flags: ''
        };
        $(`${scope} .immunity span`).html(`${data.immunity}%`);
        if (data.server === 'all') {
          data.server = null;
        }
        $(".actions input:checked", node).forEach(function(i) {
          return data.flags += i.value;
        });
        time = $(`${scope} .usetime span`).html();
        if (time === !null || time !== '') {
          data.usetime = window.style.duration.parse(time);
        }
        window.endpoint.api.roles[uuid].post(data, function(err, data) {
          state = that.getAttribute('class');
          old = state;
          if (data.success) {
            state += ' explicit green';
          } else {
            state += ' explicit red';
          }
          that.setAttribute('class', state);
          setTimeout(function() {
            return that.setAttribute('class', old);
          }, 1200);
          return data;
        });
        break;
      case 'mutegag':
      case 'ban':
        user = $('input.user')[0].value;
        server = $('input.server')[0].value;
        now = new Date();
        now = now.getTime() / 1000;
        time = $(".icon.time input", node)[0].value;
        if (time !== '') {
          time = new Date(time);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        payload = {
          length: parseInt(time - now),
          reason: $(".icon.reason span", node).html()
        };
        if (server !== '') {
          payload.server = server;
        }
        if (mode === 'mutegag') {
          payload.type = '';
          $('.icon.modes .red', node).forEach(function(e) {
            payload.type += e.getAttribute('data-type');
            return console.log(payload.type);
          });
          if (payload.type.match(/mute/) && payload.type.match(/gag/)) {
            payload.type = 'both';
          }
          if (payload.type === '') {
            payload.type = 'both';
          }
        }
        window.endpoint.api.users[user][mode].post(payload, function(err, data) {
          state = that.getAttribute('class');
          old = state;
          if (data.success) {
            state += ' explicit green';
          } else {
            state += ' explicit red';
          }
          that.setAttribute('class', state);
          setTimeout(function() {
            return that.setAttribute('class', old);
          }, 1200);
          return data;
        });
        break;
      case 'server':
        console.log('placeholder');
    }
  };

  edit = function(mode = '', that) {
    var date, node, now, selected, selector, target, timestamp, trigger, uuid;
    if (that.getAttribute('class').match(/save/)) {
      // this is for the actual process of saving
      save(mode, that);
      return;
    }
    node = that.parentElement.parentElement.parentElement;
    trigger = that.getAttribute('onclick');
    // this is for converting the style to be editable.
    switch (mode) {
      case 'admin__administrator':
        group = node.querySelector('.icon.group');
        uuid = $('input.uuid', node)[0].value;
        selected = $('input.role', node)[0].value;
        target = group.querySelector('span');
        $(target).remove();
        $(group).htmlAppend(`<select id='group-${uuid + '---' + selected}'></select>`);
        selector = new Choices(`#group-${uuid + '---' + selected}`, {
          searchEnabled: false,
          choices: [],
          classNames: {
            containerOuter: 'choices edit'
          }
        });
        selector.passedElement.addEventListener('change', function(e) {
          target = $('.server span', node);
          server = selector.getValue().customProperties.server;
          if (server === null) {
            return target.html('all');
          } else {
            return window.endpoint.api.servers[server].get(function(err, data) {
              if (!data.success) {
                return;
              }
              return target.html(data.result.name);
            });
          }
        }, false);
        window.api.storage[uuid + '#' + selected] = selector;
        window.api.groups('', selector, selected);
        break;
      case 'admin__groups':
        server = node.querySelector('.icon.server');
        uuid = $('input.uuid', node)[0].value;
        selected = $('input.server', node)[0].value;
        if (selected === '') {
          selected = 'all';
        }
        target = server.querySelector('span');
        $(target).remove();
        $(server).htmlAppend(`<select id='server-${uuid}'></select>`);
        selector = new Choices(`#server-${uuid}`, {
          searchEnabled: false,
          choices: [],
          classNames: {
            containerOuter: 'choices edit small'
          }
        });
        $('.icon.group .actions', node).removeClass('disabled').addClass('enabled');
        $(".icon.usetime", node).addClass('input-wrapper');
        $(".icon.usetime span i", node).remove();
        $(".icon.usetime span", node).on('focusout', function(event, ui) {
          var field, sd, seconds;
          field = $(this);
          sd = field.html();
          seconds = window.style.duration.parse(sd);
          if (sd !== '' && seconds === 0) {
            return field.css('border-bottom-color', '#FF404B');
          } else {
            field.css('border-bottom-color', '');
            return field.html(window.style.duration.string(seconds));
          }
        });
        $(".icon.immunity", node).addClass('input-wrapper');
        $(".icon.name", node).addClass('input-wrapper');
        $(".icon span", node).addClass('input');
        $(".icon span", node).forEach(function(el) {
          return el.setAttribute('contenteditable', 'true');
        });
        window.api.storage[uuid] = selector;
        window.api.servers('', selector, selected);
        break;
      case 'ban':
      case 'mutegag':
        $(".icon.reason", node).addClass('input-wrapper');
        $(".icon.reason span", node).addClass('input');
        // $(".icon.reason span", node).css('height', "31px")
        $(".icon.reason span", node)[0].setAttribute('contenteditable', 'true');
        $(".icon.time", node).addClass('input-wrapper');
        timestamp = parseInt($(".icon.time span", node)[0].getAttribute('data-timestamp')) * 1000;
        date = new Date(timestamp);
        date = window.style.utils.date.convert.to.iso(date);
        now = window.style.utils.date.convert.to.iso(new Date());
        $(".icon.time", node).htmlAppend(`<input type='datetime-local' min='${now}' value='${date}'>`);
        $(".icon.time span", node).remove();
        $(".icon.modes div", node).addClass('action').forEach(function(el) {
          return el.setAttribute('onclick', 'window.style.mutegag.toggle(this)');
        });
        $(".icon.modes div svg", node).forEach(function(el) {
          el = $(el);
          if (el.hasClass('gray')) {
            el.removeClass('gray').addClass('red');
          }
          if (el.hasClass('white')) {
            return el.removeClass('white').addClass('gray');
          }
        });
        break;
      case 'server':
        console.log('placeholder');
    }
    $(that).css('opacity', '0');
    setTimeout(function() {
      var transition;
      $(that).htmlAfter("<i class='save opacity animated' data-feather='save'></i>");
      feather.replace();
      transition = that.parentElement.querySelector('.save.opacity.animated');
      $(that).remove();
      // we need this timeout so that the transition can be applied properly
      // i know this is not the perfect way, but it is still better than twilight
      return setTimeout(function() {
        transition.setAttribute('onclick', trigger);
        return $(transition).css('opacity', '1');
      }, 300);
    }, 300);
  };

  submit = function(mode = '', that) {
    var data, i, j, len, node, now, ref, time, type, user;
    switch (mode) {
      case 'admin__administrator':
        data = {
          role: window.groupinput.getValue(true),
          promotion: true,
          force: true
        };
        user = window.usernameinput.getValue(true);
        window.endpoint.api.users[user].post(data, function(err, data) {
          if (data.success) {
            window.style.submit(that);
          } else {
            window.style.submit(that, false);
          }
          return data;
        });
        return setTimeout(function() {
          window.style.submit(that, false, true);
          return window.ajax.admin.admins(1);
        }, 3000);
      case 'admin__groups':
        data = {
          name: $("#inputgroupname").value,
          server: window.serverinput.getValue(true),
          immunity: parseInt($("#inputimmunityvalue").value),
          usetime: null,
          flags: ''
        };
        if (data.server === 'all') {
          data.server = null;
        }
        ref = $(".row.add .actions input:checked");
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          data.flags += $(i).value;
        }
        time = $("#inputtimevalue").value;
        if (time === !null || time !== '') {
          data.usetime = window.style.duration.parse(time);
        }
        window.endpoint.api.roles.put(data, function(err, data) {
          if (data.success) {
            window.style.submit(that);
          } else {
            window.style.submit(that, false);
          }
          return data;
        });
        return setTimeout(function() {
          window.style.submit(that, false, true);
          return window.ajax.ban.user(1);
        }, 3000);
      case 'ban':
        now = new Date();
        now = now.getTime() / 1000;
        time = $("#inputduration")[0].value;
        if (time !== '') {
          time = new Date($("#inputduration")[0].value);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        user = window.usernameinput.getValue(true);
        data = {
          reason: $("#inputdescription")[0].value,
          length: parseInt(time - now)
        };
        server = window.serverinput.getValue(true);
        if (server !== 'all') {
          data.server = server;
        }
        console.log(data);
        window.endpoint.api.users[user].ban.put(data, function(err, data) {
          if (data.success) {
            return window.style.submit(that);
          } else {
            return window.style.submit(that, false);
          }
        });
        return setTimeout(function() {
          window.style.submit(that, false, true);
          return window.ajax.ban.user(1);
        }, 3000);
      case 'mutegag':
        now = new Date();
        now = now.getTime() / 1000;
        time = $("#inputduration")[0].value;
        if (time !== '') {
          time = new Date(time);
          time = time.getTime() / 1000;
        } else {
          time = 0;
        }
        user = window.usernameinput.getValue(true);
        type = '';
        $('.row.add .action .selected').forEach(function(e) {
          return type += e.id;
        });
        if (type.match(/mute/) && type.match(/gag/)) {
          type = 'both';
        }
        if (type === '') {
          type = 'both';
        }
        data = {
          reason: $("#inputdescription")[0].value,
          length: parseInt(time - now),
          type: type
        };
        server = window.serverinput.getValue(true);
        if (server !== 'all') {
          data.server = server;
        }
        window.endpoint.api.users[user].mutegag.put(data, function(err, data) {
          if (data.success) {
            window.style.submit(that);
          } else {
            window.style.submit(that, false);
          }
          return data;
        });
        return setTimeout(function() {
          window.style.submit(that, false, true);
          return window.ajax.mutegag.user(1);
        }, 3000);
      case 'kick':
        return console.log('placeholder');
      case 'server':
        node = that.parentElement.parentElement.parentElement;
        data = {
          name: $("#inputservername")[0].value,
          ip: $('#inputip')[0].value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}/)[0],
          port: parseInt($('#inputip')[0].value.split(':')[1]),
          password: $('#inputpassword')[0].value,
          game: window.gameinput.getValue(true),
          mode: $('#inputmode')[0].value
        };
        window.endpoint.api.servers.put(data, function(err, data) {
          if (data.success) {
            window.style.submit(that);
          } else {
            window.style.submit(that, false);
          }
          return data;
        });
        return setTimeout(function() {
          window.style.submit(that, false, true);
          return window.ajax.server.server(1);
        }, 3000);
      default:
        return console.log('stuff');
    }
  };

  window.api = {
    servers: server,
    groups: group,
    submit: submit,
    remove: remove,
    edit: edit,
    storage: {}
  };

}).call(this);
