#= require style.fermata.coffee
#= require style.ext.coffee
#= require style.time.coffee


copyTextToClipboard = (text) ->
  textArea = document.createElement('textarea')
  # https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0

  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = 0

  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'

  textArea.style.background = 'transparent'
  textArea.value = text
  document.body.appendChild textArea
  textArea.focus()
  textArea.select()
  try
    successful = document.execCommand('copy')
    msg = if successful then 'successful' else 'unsuccessful'
  catch err
    console.log 'Oops, unable to copy'

  document.body.removeChild textArea
  return

InputVerification = (mode, event, that) ->
  keycode = undefined
  if window.event
    keycode = window.event.keyCode
  else if event
    keycode = event.which

  character = String.fromCharCode(event.keyCode)
  switch mode
    when 'single'
      if keycode == 13
        return false

  return true


InformationCard = (show = true, reason) ->
  if show
    output = ''
    reason.forEach((i) ->
      if typeof i == 'string'
        output += "<div class='content'>#{i}</div>"
      else if typeof i == 'object'
        Object.keys(i).forEach((k) ->
          i[k].forEach((state) ->
            state = state.replace /of uuid type/g, 'present'
            state = state.replace /value/g, i[k]

            if state.search k == -1
              state = "#{k} #{state}"

            output += "<div class='content'>#{state}</div>"
          )
        )
    )
    $('.status-card .info').html output
    $('.status-card').addClass 'active'

  else
    $('.status-card').removeClass 'active'

window.style.getOrCreate('utils').getOrCreate('verify').input = InputVerification
window.style.card = InformationCard
window.style.copy = copyTextToClipboard

window.endpoint =
  api: fermata.hawpi "/api/v1"
  ajax: fermata.raw {base: window.location.origin + "/ajax/v1"}
  bare: fermata.raw {base: window.location.origin}
