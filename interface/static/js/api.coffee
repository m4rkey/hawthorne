`
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
`

server = (query, that=null, selected='') ->
  window.endpoint.api.servers({'query': query}).get((err, data) ->
    data = data.result

    if that != null
      formatted = [{'value': 'all', 'label': '<b>all</b>'}]

      if selected == 'all'
        formatted[0].selected = true

      for ele in data
        fmt =
          value: ele.id
          label: ele.name

        if selected != '' and fmt.value == selected
          fmt.selected = true

        formatted.push fmt
      that.setChoices(formatted, 'value', 'label', true)

    return data
  )
  return

group = (query, that=null, selected='') ->
  window.endpoint.api.roles({'query': query}).get((err, data) ->
    data = data['result']

    if that != null
      formatted = []
      for ele in data
        fmt =
          value: ele.id
          label: ele.name
          customProperties:
            server: ele.server

        if selected != '' and fmt.value == selected
          fmt.selected = true

        formatted.push fmt
      that.setChoices(formatted, 'value', 'label', true)

    return data
  )
  return

remove = (mode='', that) ->
  state = that.getAttribute 'class'

  if not state.match /confirmation/
    state += ' explicit red confirmation'
    that.setAttribute 'class', state
    return

  payload = {}
  node = that.parentElement.parentElement.parentElement

  switch mode
    when 'admin__administrator'
      user = $('input.uuid', node)[0].value
      role = $('input.role', node)[0].value

      payload =
        reset: true
        role: role

      endpoint = window.endpoint.api.users[user]
    when 'admin__groups'
      role = $('input.uuid', node)[0].value

      endpoint = window.endpoint.api.roles[role]
    when 'ban'
      user = $('input.user', node)[0].value
      server = $('input.server', node)[0].value

      console.log $('input.user', node)[0]
      console.log user

      payload =
        server: server

      endpoint = window.endpoint.api.users[user].ban
    when 'mutegag'
      console.log $('input.user', node)[0].value
      user = $('input.user', node)[0].value
      server = $('input.server', node)[0].value

      if server != ''
        payload =
          server: server

      endpoint = window.endpoint.api.users[user].mutegag
    when 'server'
      node = that.parentElement.parentElement.parentElement.parentElement
      server = $('input.uuid', node)[0].value

      console.log server
      endpoint = window.endpoint.api.servers[server]
    else
      return

  endpoint.delete(payload, (err, data) ->
    if data.success
      $(node).remove()
  )
  return

save = (mode='', that) ->
  node = that.parentElement.parentElement.parentElement

  switch mode
    when 'admin__administrator'
      role = $('input.role', node)[0].value
      uuid = $('input.uuid', node)[0].value

      selector = window.api.storage[uuid + '#' + role]
      replacement = selector.getValue(true)

      payloads = [
        payload =
          promotion: false
          role: role
        payload =
          promotion: true
          role: replacement
      ]

      success = 0
      for payload in payloads
        window.endpoint.api.users[uuid].post(payload, (err, data) ->
          if (!data.success)
            return

          success += 1
        )

      state = that.getAttribute 'class'
      old = state

      if success == 2
        state += ' explicit red'
      else
        state += ' explicit green'
      that.setAttribute 'class', state

      setTimeout(->
        that.setAttribute 'class', old
      , 1200)

    when 'admin__groups'
      scope = cssPath node

      uuid = $("input.uuid", node)[0].value

      data =
        name: $("#{scope} .name span").html()
        server: window.api.storage[uuid].getValue(true)
        immunity: parseInt $("#{scope} .immunity span").html().match(/([0-9]|[1-8][0-9]|9[0-9]|100)(?:%)?$/)[1]
        usetime: -1
        flags: ''

      $("#{scope} .immunity span").html("#{data.immunity}%")
      if data.server == 'all'
        data.server = null

      $(".actions input:checked", node).forEach((i) ->
        data.flags += i.value
      )

      time = $("#{scope} .usetime span").html()
      if time is not null or time != ''
        data.usetime = window.style.duration.parse(time)

      window.endpoint.api.roles[uuid].post(data, (err, data) ->
        state = that.getAttribute 'class'
        old = state

        if data.success
          state += ' explicit green'
        else
          state += ' explicit red'
        that.setAttribute 'class', state

        setTimeout(->
          that.setAttribute 'class', old
        , 1200)

        return data
      )

    when 'mutegag', 'ban'
      user = $('input.user')[0].value
      server = $('input.server')[0].value

      now = new Date()
      now = now.getTime() / 1000

      time = $(".icon.time input", node)[0].value

      if time != ''
        time = new Date time
        time = time.getTime() / 1000
      else
        time = 0

      payload =
        length: parseInt(time - now)
        reason: $(".icon.reason span", node).html()

      if server != ''
        payload.server = server

      if mode == 'mutegag'
        payload.type = ''
        $('.icon.modes .red', node).forEach((e) ->
          payload.type += e.getAttribute 'data-type'
          console.log payload.type
        )

        if payload.type.match(/mute/) and payload.type.match(/gag/)
          payload.type = 'both'

        if payload.type == ''
          payload.type = 'both'

      window.endpoint.api.users[user][mode].post(payload, (err, data) ->
        state = that.getAttribute 'class'
        old = state

        if data.success
          state += ' explicit green'
        else
          state += ' explicit red'
        that.setAttribute 'class', state

        setTimeout(->
          that.setAttribute 'class', old
        , 1200)

        return data
      )

    when 'server'
      console.log 'placeholder'

  return

edit = (mode='', that) ->
  if that.getAttribute('class').match /save/
    # this is for the actual process of saving
    save mode, that
    return

  node = that.parentElement.parentElement.parentElement
  trigger = that.getAttribute 'onclick'

  # this is for converting the style to be editable.
  switch mode
    when 'admin__administrator'
      group = node.querySelector('.icon.group')

      uuid = $('input.uuid', node)[0].value
      selected = $('input.role', node)[0].value
      target = group.querySelector('span')
      $(target).remove()

      $(group).htmlAppend("<select id='group-#{uuid + '---' + selected}'></select>")
      selector = new Choices("#group-#{uuid + '---' + selected}", {
        searchEnabled: false,
        choices: [],
        classNames: {
          containerOuter: 'choices edit'
        }
      })

      selector.passedElement.addEventListener('change', (e) ->
        target = $('.server span', node)
        server = selector.getValue().customProperties.server
        if server == null
          target.html 'all'
        else
          window.endpoint.api.servers[server].get((err, data) ->
            if not data.success
              return
            target.html data.result.name
          )

      , false)

      window.api.storage[uuid + '#' + selected] = selector
      window.api.groups('', selector, selected)

    when 'admin__groups'
      server = node.querySelector('.icon.server')

      uuid = $('input.uuid', node)[0].value
      selected = $('input.server', node)[0].value

      if selected == ''
        selected = 'all'

      target = server.querySelector('span')
      $(target).remove()

      $(server).htmlAppend("<select id='server-#{uuid}'></select>")
      selector = new Choices("#server-#{uuid}", {
        searchEnabled: false,
        choices: [],
        classNames: {
          containerOuter: 'choices edit small'
        }
      })

      $('.icon.group .actions', node).removeClass('disabled').addClass('enabled')
      $(".icon.usetime", node).addClass('input-wrapper')
      $(".icon.usetime span i", node).remove()
      $(".icon.usetime span", node).on('focusout', (event, ui) ->
        field = $(this)
        sd = field.html()
        seconds = window.style.duration.parse(sd)

        if sd != '' and seconds == 0
          field.css 'border-bottom-color', '#FF404B'
        else
          field.css 'border-bottom-color', ''
          field.html window.style.duration.string(seconds)
      )

      $(".icon.immunity", node).addClass('input-wrapper')
      $(".icon.name", node).addClass('input-wrapper')

      $(".icon span", node).addClass('input')
      $(".icon span", node).forEach((el) ->
        el.setAttribute 'contenteditable', 'true'
      )

      window.api.storage[uuid] = selector
      window.api.servers('', selector, selected)

    when 'ban', 'mutegag'
      $(".icon.reason", node).addClass('input-wrapper')
      $(".icon.reason span", node).addClass('input')
      # $(".icon.reason span", node).css('height', "31px")
      $(".icon.reason span", node)[0].setAttribute('contenteditable', 'true')

      $(".icon.time", node).addClass('input-wrapper')
      timestamp = parseInt($(".icon.time span", node)[0].getAttribute('data-timestamp')) * 1000

      date = new Date timestamp
      date = window.style.utils.date.convert.to.iso(date)

      now = window.style.utils.date.convert.to.iso(new Date())

      $(".icon.time", node).htmlAppend("<input type='datetime-local' min='#{now}' value='#{date}'>")
      $(".icon.time span", node).remove()

      $(".icon.modes div", node).addClass('action').forEach((el) ->
        el.setAttribute 'onclick', 'window.style.mutegag.toggle(this)'
      )

      $(".icon.modes div svg", node).forEach((el) ->
        el = $(el)
        if el.hasClass('gray')
          el.removeClass('gray').addClass('red')

        if el.hasClass('white')
          el.removeClass('white').addClass('gray')
      )

    when 'server'
      console.log 'placeholder'

  $(that).css('opacity', '0')
  setTimeout(->
    $(that).htmlAfter("<i class='save opacity animated' data-feather='save'></i>")
    feather.replace()

    transition = that.parentElement.querySelector('.save.opacity.animated')
    $(that).remove()

    # we need this timeout so that the transition can be applied properly
    # i know this is not the perfect way, but it is still better than twilight
    setTimeout( ->
      transition.setAttribute 'onclick', trigger
      $(transition).css('opacity', '1')
    , 300)
  , 300)
  return

submit = (mode='', that) ->
  switch mode
    when 'admin__administrator'
      data =
        role: window.groupinput.getValue(true)
        promotion: true
        force: true

      user = window.usernameinput.getValue(true)

      window.endpoint.api.users[user].post(data, (err, data) ->
        if data.success
          window.style.submit(that)
        else
          window.style.submit(that, false)

        return data
      )

      setTimeout(->
        window.style.submit(that, false, true)
        window.ajax.admin.admins(1)
      , 3000)

    when 'admin__groups'
      data =
        name: $("#inputgroupname").value
        server: window.serverinput.getValue(true)
        immunity: parseInt $("#inputimmunityvalue").value
        usetime: null
        flags: ''

      if data.server == 'all'
        data.server = null

      for i in $(".row.add .actions input:checked")
        data.flags += $(i).value

      time = $("#inputtimevalue").value
      if time is not null or time != ''
        data.usetime = window.style.duration.parse(time)

      window.endpoint.api.roles.put(data, (err, data) ->
        if data.success
          window.style.submit(that)
        else
          window.style.submit(that, false)

        return data
      )

      setTimeout(->
        window.style.submit(that, false, true)
        window.ajax.ban.user(1)
      , 3000)

    when 'ban'
      now = new Date()
      now = now.getTime() / 1000

      time = $("#inputduration")[0].value

      if time != ''
        time = new Date $("#inputduration")[0].value
        time = time.getTime() / 1000
      else
        time = 0

      user = window.usernameinput.getValue(true)

      data =
        reason: $("#inputdescription")[0].value
        length: parseInt(time - now)

      server = window.serverinput.getValue(true)
      if server != 'all'
        data.server = server

      console.log data
      window.endpoint.api.users[user].ban.put(data, (err, data) ->
        if data.success
          window.style.submit(that)
        else
          window.style.submit(that, false)
      )

      setTimeout(->
        window.style.submit(that, false, true)
        window.ajax.ban.user(1)
      , 3000)

    when 'mutegag'
      now = new Date()
      now = now.getTime() / 1000

      time = $("#inputduration")[0].value

      if time != ''
        time = new Date time
        time = time.getTime() / 1000
      else
        time = 0

      user = window.usernameinput.getValue(true)

      type = ''
      $('.row.add .action .selected').forEach((e) ->
        type += e.id
      )

      if type.match(/mute/) and type.match(/gag/)
        type = 'both'

      if type == ''
        type = 'both'

      data =
        reason: $("#inputdescription")[0].value
        length: parseInt(time - now)
        type: type

      server = window.serverinput.getValue(true)
      if server != 'all'
        data.server = server

      window.endpoint.api.users[user].mutegag.put(data, (err, data) ->
        if data.success
          window.style.submit(that)
        else
          window.style.submit(that, false)

        return data
      )

      setTimeout(->
        window.style.submit(that, false, true)
        window.ajax.mutegag.user(1)
      , 3000)

    when 'kick'
      console.log 'placeholder'

    when 'server'
      node = that.parentElement.parentElement.parentElement

      data =
        name: $("#inputservername")[0].value
        ip: $('#inputip')[0].value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}/)[0]
        port: parseInt $('#inputip')[0].value.split(':')[1]
        password: $('#inputpassword')[0].value
        game: window.gameinput.getValue(true)
        mode: $('#inputmode')[0].value

      window.endpoint.api.servers.put(data, (err, data) ->
        if data.success
          window.style.submit(that)
        else
          window.style.submit(that, false)

        return data
      )

      setTimeout(->
        window.style.submit(that, false, true)
        window.ajax.server.server(1)
      , 3000)
    when 'server__execute'
      node = that.parentElement.parentElement.parentElement.parentElement
      uuid = $('input.uuid', node)[0].value
      value = $('pre.input', node)[0].textContent

      payload =
        command: value

      $(that).addClass 'orange'
      window.endpoint.api.servers[uuid].execute.put(payload, (err, data) ->
        if data.success
          $(that).addClass 'green'
          output = $('pre.ro', node)
          output.html data.result.response

          console.log output[0].innerHTML
          output[0].innerHTML = "<span class='line'>"+(output[0].textContent.split("\n").filter(Boolean).join("</span>\n<span class='line'>"))+"</span>";

          output.removeClass 'none'
          $('pre.input', node).addClass 'evaluated'
          output.css 'max-height', output[0].scrollHeight+'px'

        else
          $(that).addClass 'red'

        $(that).removeClass 'orange'
        return data
      )

      setTimeout(->
        $(that).removeClass 'red'
        $(that).removeClass 'green'
        $(that).addClass 'white'
        # window.style.submit(that, false, true)
      , 3000)

    else
      console.log 'stuff'

window.api =
  servers: server
  groups: group
  submit: submit
  remove: remove
  edit: edit
  storage: {}
