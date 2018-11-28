var k=k||{};k.scope={};k.ASSUME_ES5=!1;k.ASSUME_NO_NATIVE_MAP=!1;k.ASSUME_NO_NATIVE_SET=!1;k.defineProperty=k.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(e,b,c){e!=Array.prototype&&e!=Object.prototype&&(e[b]=c.value)};k.getGlobal=function(e){return"undefined"!=typeof window&&window===e?e:"undefined"!=typeof global&&null!=global?global:e};k.global=k.getGlobal(this);
k.polyfill=function(e,b){if(b){var c=k.global;e=e.split(".");for(var a=0;a<e.length-1;a++){var g=e[a];g in c||(c[g]={});c=c[g]}e=e[e.length-1];a=c[e];b=b(a);b!=a&&null!=b&&k.defineProperty(c,e,{configurable:!0,writable:!0,value:b})}};
k.polyfill("Array.from",function(e){return e?e:function(b,c,a){c=null!=c?c:function(a){return a};var g=[],f="undefined"!=typeof Symbol&&Symbol.iterator&&b[Symbol.iterator];if("function"==typeof f){b=f.call(b);for(var d=0;!(f=b.next()).done;)g.push(c.call(a,f.value,d++))}else for(f=b.length,d=0;d<f;d++)g.push(c.call(a,b[d],d));return g}},"es6","es3");
(function(){var e=function(b,c){var a={};switch(void 0===b?"":b){case "punishment":var g=c.getAttribute("data-id");var f=c.getAttribute("data-user");f=window.endpoint.api.users[f].punishments[g];break;case "admins[server][admins]":g=c.getAttribute("data-id");f=c.getAttribute("data-user");f=window.endpoint.api.users[f];a={roles:[g],reset:!1};break;case "admins[server][roles]":g=c.getAttribute("data-id");f=window.endpoint.api.roles[g];break;case "admins[web][admins]":b=c.getAttribute("data-id");f=c.getAttribute("data-user");
f=window.endpoint.api.users[f];a={groups:[b],reset:!1};break;case "admins[web][groups]":b=c.getAttribute("data-id");f=window.endpoint.api.groups[b];break;case "servers[detailed]":g=c.getAttribute("data-id"),f=window.endpoint.api.servers[g]}return f.delete({},{},a,function(a,b){b.success&&(c.hasAttribute("data-opacity")&&(g=c.getAttribute("data-id"),a=$("[data-id='"+g+"']").css("opacity","0.5").removeClass("logSelected"),$(".checkboxDialogue",a).fadeOut("fast"),$(".checkmarkContainer",a).css("visibility",
"hidden")),c.hasAttribute("data-remove")&&$(c).remove(),c.hasAttribute("data-visibility")&&$(c).css("visibility","hidden"),c.hasAttribute("data-redirect")&&window.vc())})};window.api.remove=function(b,c,a){b=void 0===b?"":b;(void 0===a?0:a)?(c=window.batch,window.batch=[]):c=[c];c.forEach(function(a){return e(b,a)})}}).call(this);
(function(){var e=function(b,c){b=void 0===b?"":b;var a,g;var f={target:c,skip_animation:!1};var d=c.parentElement.parentElement.parentElement;switch(b){case "admin__administrator":f=$("input.role",d)[0].value;b=$("input.uuid",d)[0].value;var e=window.api.storage[b+"#"+f];d=e.getValue(!0);e=[a={promotion:!1,role:f},a={promotion:!0,role:d}];d=g=0;for(f=e.length;d<f;d++)a=e[d],window.endpoint.api.users[b].post(a,function(a,b){if(b.success)return g+=1});var h=$(c);2===g?h.addClass("explicit red"):h.addClass("explicit green");
setTimeout(function(){return h.removeClass("explicit green red")},1200);break;case "admin__groups":b=$("input.uuid",d)[0].value;var l={name:$(".name span",d).html(),server:window.api.storage[b].getValue(!0),immunity:parseInt($(".immunity span",d).html().match(/([0-9]|[1-8][0-9]|9[0-9]|100)(?:%)?$/)[1]),usetime:-1,flags:""};$(".immunity span",d).html(l.immunity+"%");"all"===l.server&&(l.server=null);$(".actions input:checked",d).forEach(function(a){return l.flags+=a.value});c=$(".usetime span",d).html();
if(!0===c||""!==c)l.usetime=window.style.duration.parse(c);window.endpoint.api.roles[b].post(f,{},l,function(){});break;case "mutegag":case "ban":var q=$("input.user",d)[0].value;var p=$("input.server",d)[0].value;var r=$("input.punishment",d)[0].value;e=parseInt($(".icon.time",d)[0].getAttribute("data-created"));c=$(".icon.time input",d)[0].value;""!==c?(c=new Date(c),c=c.getTime()/1E3):c=0;a={length:parseInt(c-e),reason:$(".icon.reason span",d).html()};""!==p&&(a.server=p);"ban"===b&&(a.banned=
!0);"mutegag"===b&&($(".icon.modes .red",d).forEach(function(b){return a.type+=b.getAttribute("data-type")}),a.muted=!1,a.gagged=!1,a.type.match(/mute/)&&a.type.match(/gag/)&&(a.muted=!0,a.gagged=!0),""===a.type&&(a.muted=!0,a.gagged=!0),type.match(/mute/)&&(a.muted=!0),type.match(/gag/)&&(a.gagged=!0));window.endpoint.api.users[q].punishments[r].post(f,{},a,function(){});break;case "server":d=d.parentElement;b=$("input.uuid",d)[0].value;e=window.api.storage[b];a={game:e.getValue(!0),gamemode:$(".icon.gamemode span",
d).html(),ip:$(".icon.network span",d).html().split(":")[0],port:parseInt($(".icon.network span",d).html().split(":")[1])};d=$(".icon.password input",d)[0].value;""!==d&&(a.password=d);window.endpoint.api.servers[b].post(f,{},a,function(){});break;case "setting__user":b=$("input.uuid",d)[0].value;e=window.api.storage[b];var n=[];$(".permission__child:checked",d).forEach(function(a){a=a.id;a=a.replace(/\s/g,"");a=a.split("__");a=a[0]+"."+a[1];return n.push(a)});a={permissions:n,groups:e.getValue(!0)};
window.endpoint.api.users[b].post(f,{},a,function(){});break;case "setting__group":b=$("input.uuid",d)[0].value,n=[],$(".permission__child:checked",d).forEach(function(a){a=a.id;a=a.replace(/\s/g,"");a=a.split("__");a=a[0]+"."+a[1];return n.push(a)}),a={permissions:n},window.endpoint.api.groups[b].post(f,{},a,function(){})}};window.api.edit=function(b,c){b=void 0===b?"":b;if(c.getAttribute("class").match(/save/))e(b,c);else{var a=c.parentElement.parentElement.parentElement;var g=c.getAttribute("onclick");
switch(b){case "admin__administrator":var f=a.querySelector(".icon.group");b=$("input.uuid",a)[0].value;var d=$("input.role",a)[0].value;var m=f.querySelector("span");$(m).remove();$(f).htmlAppend("<select id='group-"+(b+"---"+d)+"'></select>");var h=new Choices("#group-"+(b+"---"+d),{searchEnabled:!1,choices:[],classNames:{containerOuter:"choices edit"}});h.passedElement.addEventListener("change",function(){m=$(".server span",a);var b=h.getValue().customProperties.server;return null===b?m.html("all"):
window.endpoint.api.servers[b].get(function(a,b){if(b.success)return m.html(b.result.name)})},!1);window.api.storage[b+"#"+d]=h;window.api.roles("",h,d);break;case "admin__groups":f=a.querySelector(".icon.server");b=$("input.uuid",a)[0].value;d=$("input.server",a)[0].value;""===d&&(d="all");m=f.querySelector("span");$(m).remove();$(f).htmlAppend("<select id='server-"+b+"'></select>");h=new Choices("#server-"+b,{searchEnabled:!1,choices:[],classNames:{containerOuter:"choices edit small"}});$(".icon.group .actions",
a).removeClass("disabled").addClass("enabled");$(".icon.usetime",a).addClass("input-wrapper");$(".icon.usetime span i",a).remove();$(".icon.usetime span",a).on("focusout",function(){var a=$(this);var b=a.html();var c=window.style.duration.parse(b);if(""!==b&&0===c)return a.css("border-bottom-color","#FF404B");a.css("border-bottom-color","");return a.html(window.style.duration.string(c))});$(".icon.immunity",a).addClass("input-wrapper");$(".icon.name",a).addClass("input-wrapper");$(".icon span",a).addClass("input");
$(".icon span",a).forEach(function(a){return a.setAttribute("contenteditable","true")});window.api.storage[b]=h;window.api.servers("",h,d);break;case "ban":case "mutegag":$(".icon.reason",a).addClass("input-wrapper");$(".icon.reason span",a).addClass("input");$(".icon.reason span",a)[0].setAttribute("contenteditable","true");$(".icon.time",a).addClass("input-wrapper");b=1E3*parseInt($(".icon.time span",a)[0].getAttribute("data-timestamp"));b=new Date(b);b=window.style.utils.date.convert.to.iso(b);
d=window.style.utils.date.convert.to.iso(new Date);$(".icon.time",a).htmlAppend("<input type='datetime-local' min='"+d+"' value='"+b+"'>");$(".icon.time span",a).remove();$(".icon.modes div",a).addClass("action").forEach(function(a){return a.setAttribute("onclick","window.style.mutegag.toggle(this)")});$(".icon.modes div svg",a).forEach(function(a){a=$(a);a.hasClass("gray")&&a.removeClass("gray").addClass("red");if(a.hasClass("white"))return a.removeClass("white").addClass("gray")});break;case "server":a=
a.parentElement;b=$("input.uuid",a)[0].value;d=$(".icon.game",a);$("span",d[0]).remove();d.htmlAppend("<select id='server-"+b+"'></select>");h=new Choices("#server-"+b,{searchEnabled:!1,choices:[],classNames:{containerOuter:"choices edit big"}});window.api.games(h,d[0].getAttribute("data-value"));$(".icon.gamemode",a).addClass("input-wrapper big");$(".icon.gamemode span",a).addClass("input");$(".icon.gamemode span",a)[0].setAttribute("contenteditable","true");$(".icon.network",a).addClass("input-wrapper big");
$(".icon.network span",a).addClass("input");$(".icon.network span",a)[0].setAttribute("contenteditable","true");$(".icon.password",a).addClass("input-wrapper big");$(".icon.password",a).htmlAppend('<input type="password", placeholder="Password"></input>');$(".icon.password span",a).remove();window.api.storage[b]=h;break;case "setting__user":$(".column.animated",a).toggleClass("collapsed");b=$("input.uuid",a)[0].value;d=$(".column.groups",a);d.htmlAppend("<select id='user-group-"+b+"' multiple></select>");
h=new Choices("#user-group-"+b,{choices:[],duplicateItems:!1,paste:!1,searchEnabled:!1,searchChoices:!1,removeItemButton:!0,classNames:{containerOuter:"choices edit"}});window.api.groups("",h,$("span",d).html().split(", "));$("span",d).remove();window.style.settings.init(!0);window.api.storage[b]=h;break;case "setting__group":$(".column.animated",a).toggleClass("collapsed"),window.style.settings.init(!0)}$(c).css("opacity","0");setTimeout(function(){$(c).htmlAfter("<i class='save opacity animated' data-feather='save'></i>");
feather.replace();var a=c.parentElement.querySelector(".save.opacity.animated");$(c).remove();return setTimeout(function(){a.setAttribute("onclick",g);return $(a).css("opacity","1")},300)},300)}}}).call(this);
(function(){var e=function(b,c){b=void 0===b?"":b;var a={};var e={};Array.from(c.elements).forEach(function(b){if(!$(b).hasClass("skip"))return b.hasAttribute("multiple")?(e=Array.from(b.options),a[b.name]=e.map(function(a){return a.value})):a[b.name]=b.value});console.log(a);switch(b){case "admins[web][groups]":var f=window.endpoint.api.groups}f.put(e,{},a,function(a,b){if(b.success)return c.reset()})};window.api.create=function(b,c,a){b=void 0===b?"":b;(void 0===a?0:a)?(c=window.batch,window.batch=
[]):c=[c];c.forEach(function(a){return e(b,a)})}}).call(this);
