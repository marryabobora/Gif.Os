console.log("gifOS.js :D");
loadTheme();

function fillTrending(blob)
{
	const container = document.getElementById('trending_container');
	const template 	= document.getElementById('trending_template');

 	template.style.display = "flex";

	for (var i = 0; i < blob.data.length; i++) {
		let title = blob.data[i].title;
		let tt = template.cloneNode(true);

		tt.querySelector("#gif").src = blob.data[i].images.preview_gif.url;
		tt.onclick = function () { buscar(title, false); };

		container.appendChild(tt);
 	}

 	template.style.display = "none"; 
}

function fillToday(blob)
{
	const template     = document.getElementById('hoy_template');
	const row_template = document.getElementById('hoy_container');

 	template.style.display	   = "block";
 	row_template.style.display = "flex";
 	
 	let num_rows = Math.ceil(blob.data.length / 4);
 	let num_gifs = blob.data.length;
	let last_row = row_template;

	for (var i = 0; i < num_rows; i++) {

		let rt = row_template.cloneNode(false);

 		for (var j = 0; j < Math.min(num_gifs, 4); j++) {
			let title = blob.data[i * 4 + j].title;
			let tt = template.cloneNode(true);

			tt.querySelector("#gif").src = blob.data[i * 4 + j].images.preview_gif.url;
			tt.querySelector("#hashtags").innerText = blob.data[i * 4 + j].title;
			tt.onclick = function () { buscar(title, false); };

			rt.appendChild(tt);

	 	}
		
		num_gifs -= 4;

	 	last_row.after(rt);
	 	last_row = rt;
 	}

 	row_template.style.display = "none"; 
 	template.style.display = "none"; 
}

function fillMyGifs(blob)
{
	const template     = document.getElementById('gifs_template');
	const row_template = document.getElementById('gifs_container');

 	template.style.display	   = "block";
 	row_template.style.display = "flex";
 	
 	let num_rows = Math.ceil(blob.data.length / 4);
 	let num_gifs = blob.data.length;
	let last_row = row_template;

	for (var i = 0; i < num_rows; i++) {

		let rt = row_template.cloneNode(false);

 		for (var j = 0; j < Math.min(num_gifs, 4); j++) {
			let title = blob.data[i * 4 + j].title;
			let tt = template.cloneNode(true);

			tt.querySelector("#gif").src = blob.data[i * 4 + j].images.original.url;
			tt.onclick = function () { buscar(title, false); };

			rt.appendChild(tt);

	 	}
		
		num_gifs -= 4;

	 	last_row.after(rt);
	 	last_row = rt;
 	}

 	row_template.style.display = "none"; 
 	template.style.display = "none"; 
}

function fillSearch(blob)
{
	const template 	   = document.getElementById('buscar_template');
	const row_template = document.getElementById('buscar_container');

 	template.style.display	   = "block";
 	row_template.style.display = "flex";
 	
 	let num_rows = Math.ceil(blob.data.length / 4);
 	let num_gifs = blob.data.length;
	let last_row = row_template;

	for (var i = 0; i < num_rows; i++) {

		let rt = row_template.cloneNode(false);

 		for (var j = 0; j < Math.min(num_gifs, 4); j++) {
			let tt = template.cloneNode(true);
			let title = blob.data[i * 4 + j].title;

			tt.querySelector("#gif").src = blob.data[i * 4 + j].images.preview_gif.url;
			tt.querySelector("#hashtags").innerText = blob.data[i * 4 + j].title;
			tt.onclick = function () { buscar(title, false); };

			rt.appendChild(tt);
	 	}
		
		num_gifs -= 4;

	 	last_row.after(rt);
	 	last_row = rt;
 	}

 	row_template.style.display = "none"; 
 	template.style.display     = "none"; 
}

function buscar(term, addToHistory = true)
{
	if(addToHistory)
		addTermToHistory(term);
	
	sessionStorage.setItem('buscar_term', term);

	window.location.href = 'buscar.html';
}

function buscar_suggested(i)
{
	switch(i)
	{
		case 0:
			buscar(document.getElementById('sugerido_1').querySelector("button").innerText);
			break;
		case 1:
			buscar(document.getElementById('sugerido_2').querySelector("button").innerText);
			break;
		case 2:
			buscar(document.getElementById('sugerido_3').querySelector("button").innerText);
			break;	
	}
}

function onChangeSearch()
{
	const buscar_boton = document.getElementById("buscar_boton");
	const buscar_input = document.getElementById("buscar_input");
	const sugerido_container = document.getElementById("sugerido_container");

	if(buscar_input.value == "") {
		buscar_boton.disabled = true;
		buscar_boton.querySelector("img").src = "assets/lupa_inactive.svg";
		buscar_boton.querySelector("span").style.color = "#B4B4B4";
		buscar_boton.style["background-color"] = "#EFEFEF";
		sugerido_container.style.display = "none";
	}
	else {
		buscar_boton.disabled = false;
		buscar_boton.querySelector("img").src = "assets/lupa.svg";
		buscar_boton.querySelector("span").style.color = "#000000";
		buscar_boton.style["background-color"] = "#F7C9F3";

		document.getElementById('sugerido_1').style.visibility = "hidden";
		document.getElementById('sugerido_2').style.visibility = "hidden";
		document.getElementById('sugerido_3').style.visibility = "hidden";
    	
    	suggestedSearches(buscar_input.value, fillRecommendedSearches);
	}
}

function fillRecommendedSearches(term, blob)
{
	const container	= document.getElementById('sugerido_container');
	const sugerido 	= [
						document.getElementById('sugerido_1'),
						document.getElementById('sugerido_2'),
						document.getElementById('sugerido_3'),
					  ];

  	if(term != document.getElementById("buscar_input").value)
  		return;

  	if(blob.data.length == 0) {
  		container.style.display = "none";
  		return;
  	}

	container.style.display = "flex";

	for (var i = 0; i < Math.min(3, blob.data.length); i++) {
		var term = blob.data[i].name;
		sugerido[i].querySelector("button").innerText = term;
		sugerido[i].querySelector("button").title	  = term;

		sugerido[i].style.visibility = "visible";
	}
}

function addTermToHistory(term)
{
	let config = getConfig();

	config.searchHistory.unshift(term);

	localStorage.setItem("config", JSON.stringify(config));
}

function changeTheme(isLight)
{   
	var cssFile = isLight ? "styles/style.css" : "styles/darkstyle.css";

	var oldlink = document.getElementsByTagName("link").item(1);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
	
    document.getElementById("logo-gifos").src = isLight ? "assets/gifOF_logo.png" : "assets/gifOF_logo_dark.png";

	let config = getConfig();

	config.theme = isLight ? "light" : "dark";

	localStorage.setItem("config", JSON.stringify(config));
}

function fillSearchHistory()
{
	let config = getConfig();

	const container = document.getElementById('relacionados_container');
	const template 	= document.getElementById('relacionados_template');

 	template.style.display = "block";

	for (var i = 0; i < Math.min(5, config.searchHistory.length); i++) {
		let title = config.searchHistory[i];
		let tt = template.cloneNode(true);

		tt.innerText = title;
		tt.onclick = function () { buscar(title, false); };

		container.appendChild(tt);
 	}

 	template.style.display = "none"; 
}

function getConfig()
{
	let config = localStorage.getItem("config");

	if(config == null) {
		config = {
			theme : "light",
			searchHistory : []
		};
	}
	else
		config = JSON.parse(config);

	return config;
}

function loadTheme()
{
	config = getConfig();

	changeTheme(config.theme == "light");
}