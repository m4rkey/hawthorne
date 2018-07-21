ajax = (mode, target='.main', page=1, manual=false) ->
  endpoint = window.endpoint.ajax
  header =
    "X-CSRFToken": window.csrftoken

  switch mode
    when "servers[overview]"
      endpoint = window.endpoint.ajax.servers[page]
    when "admins[servers][admins]"
      endpoint = window.endpoint.ajax.admins.servers.admins[page]


  endpoint.post(header, {}, (dummy, response) ->
    status = response.status
    data = response.data
    target = $(target)

    if status == 200
      if page == 1 or manual
        target.html('')

      target.htmlAppend(data)
      $('script.execute:not(.evaluated)', target).forEach((src) ->
        eval(src.innerHTML)
        $(src).addClass("evaluated")
      )

      if not manual
        window.ajax(mode, target, page + 1)
    return
  )

  return

lazy = (mode, fallback) ->
  endpoint = window.endpoint.ajax
  header =
    "X-CSRFToken": window.csrftoken

  if window.location.hash
    hash = window.location.hash.substring(1)
  else
    hash = fallback
    history.pushState(null, null, "##{fallback}");

  switch mode
    when "servers[detailed]"
      endpoint = window.endpoint.ajax.servers[window.slug][hash]
    when 'admins[servers]'
      endpoint = window.endpoint.ajax.admins.servers[hash]

  endpoint.post(header, {}, (dummy, response) ->
    status = response.status
    data = response.data
    target = $('.main')

    if status == 200

      $('.paginationContent', target).remove()
      target.htmlAppend(data)
      $('.paginationContent script.execute:not(.evaluated)', target).forEach((src) ->
        eval(src.innerHTML)
        $(src).addClass("evaluated")
      )
    return
  )

  return

window.ajax = ajax
window.lazy = lazy
