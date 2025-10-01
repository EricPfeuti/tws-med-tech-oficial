resultado =""
function analisarTexto(){
frase = new String(document.getElementById("frase"))
vogal1=/a/
vogal2=/e/
vogal3=/i/
vogal4=/o/
vogal5=/u/
alert(frase.match(/a/));
alert(frase.match(/e/));
alert(frase.match(/i/));
alert(frase.match(/o/));
alert(frase.match(/u/));
alert(frase.indexOf("a"));
alert(frase.lastIndexOf("a"));
alert(frase.replace("JavaScript","JS"));
alert(frase.substring(0, 10));
alert(frase.substr(10, 5));
alert(frase.split(" "));
alert(frase.toUpperCase());
alert(frase.toLowerCase());
alert(String.fromCharCode(74));
alert(frase.charCodeAt(0));}


document.getElementById("resultado").innerHTML = resultado;