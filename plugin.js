 function OnSubmitPluginInput(a,b) { if(document.location.protocol == "https:") { b = b.toLowerCase().replace("http://www","https://secure"); } var $c = $(a).parents("table:eq(1)"); var $d = $("iframe",$c); var e = $d.attr("name"); var $f = $("<form method=\"post\" action=\""+b+"\" target=\""+e+"\"></form>"); var g = $("<div>").text($("tr:last td",$c).html()).html(); var h = $c .find("input[type='text'],textarea,input[type='checkbox'],input[type='radio']") .serialize()+"&domain="+document.domain+"&hosturl="+encodeURIComponent(window.location)+"&"+$("<input type=\"hidden\" name=\"authenticate\" />").val(g).serialize(); var $i = $("<input type=\"hidden\" name=\"inputdata\" />").val(h); $f.append($i); $("body").append($f); var j = $(a).attr("disabled","disabled").val(); $(a).val("Processing..."); $d.load(function(){$(a).removeAttr("disabled").val(j)}); $f.submit(); $f.remove(); }
