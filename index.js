function correctString(e) { var t = e.replace("<", "&lt"); return t.replace(">", "&gt") } function createSimpleNode(e, t, n = "") { let r = document.createElement(e); for (let s in "" !== n && (r.innerHTML = n), t) r[s] = t[s]; return r } function charger(e) { e.style.display = "" } function decharger(e) { e.style.display = "none" } let falseTd = createSimpleNode("td", {}, "&#10025;"); class HTMLMusic { #a; #b; #c = []; constructor(e, t) { if (!e instanceof Music || !t instanceof HTMLAnime) throw Error("Illegal Argument (constructor HTMLMusic)"); this.#a = t; let n = createSimpleNode("td", { className: "favo" }, "&#10025;"); n.addEventListener("click", function () { modifFav(e.getAnime, e, n.innerHTML == falseTd.innerHTML), n.innerHTML = n.innerHTML == falseTd.innerHTML ? "&#9733;" : "&#10025;" }), this.#c.push(n), this.#c.push(createSimpleNode("td", { className: "nom_anime" }, e.getAnime.getNom)), this.#c.push(createSimpleNode("td", { className: "type_music" }, e.getType)), this.#c.push(createSimpleNode("td", { className: "numero_music" }, e.getNumero)), this.#c.push(createSimpleNode("td", { className: "nom_music" }, e.getNom)), this.#c.push(createSimpleNode("td", { className: "nom_artist" }, e.getArtist)); let r = createSimpleNode("a", { href: e.getLien, target: "_blank" }, "Lien"), s = createSimpleNode("br", {}), a = createSimpleNode("button", { style: "background-color : transparent; border : transparent;" }, "&#9658;"); a.addEventListener("click", async function () { clickAudio(e.getLien, a) }); let l = createSimpleNode("td", { className: "lien" }); l.appendChild(r), l.appendChild(s), l.appendChild(a), this.#c.push(l), this.#b = document.createElement("tr"), this.#c.forEach(e => { this.#b.appendChild(e) }) } get getHTMLAnime() { return this.#a } get getTr() { return this.#b } getTd(e) { return this.#c[e] } setBackground(e) { this.#b.style.backgroundColor = e } } class Music { #d; #e; #f; #g; #h; #i; #j; constructor(e, t, n, r, s, a) { if (e instanceof Anime && "string" == typeof t && Number.isInteger(n) && "string" == typeof r && "string" == typeof s && "string" == typeof a) this.#d = e, this.#e = t, this.#f = n, this.#g = r, this.#h = s, this.#i = a; else throw Error("Illegal Argument (constructor Music)") } get getAnime() { return this.#d } get getType() { return this.#e } get getNom() { return this.#g } get getNumero() { return this.#f } get getArtist() { return this.#h } get getLien() { return this.#i } get getHtml() { return this.#j } setHTML(e) { if (!e instanceof HTMLMusic) throw Error("Illegal Argument (setHTML HTMLAnime)"); this.#j = e } } class HTMLAnime { #b; #k = []; constructor(e) { if (!e instanceof Anime) throw Error("Illegal Argument (constructor HTMLAnime)"); this.#b = createSimpleNode("tr", { className: "grey" }); let t = createSimpleNode("td", { colSpan: "7" }); this.#b.appendChild(t); let n = createSimpleNode("div", { className: "tete" }); t.appendChild(n); let r; "2" == ModeAffichLien ? (r = createSimpleNode("div", { className: "_1 grey" }, e.getNom + "&ensp;")).appendChild(createSimpleNode("a", { href: e.getLien, target: "_blank", style: "color : darkblue;" }, "&#9032;")) : (r = createSimpleNode("div", { className: "_1 grey" })).appendChild(createSimpleNode("a", { href: e.getLien, target: "_blank" }, e.getNom)), n.appendChild(r); for (var s = 0; s < TabStringUsers.length; s++) { let a = createSimpleNode("div", { className: "_" + (s + 2) + (e.getEtatUser(s) ? " watch" : " no-watch") }, TabStringUsers[s]); n.appendChild(a) } for (let l = 0; l < e.getNbMusic; ++l) { let o = new HTMLMusic(e.getMusic(l), this); this.#k.push(o), e.getMusic(l).setHTML(o) } } get getTr() { return this.#b } get getTabTrMusic() { let e = []; return this.#k.forEach(t => { e.push(t.getTr) }), e } setBackground(e) { this.#k.forEach(t => { t.setBackground(e) }) } dechargerAll() { decharger(this.#b), this.#k.forEach(e => { decharger(e.getTr) }) } } class Anime { #g; #l; #i; #m = []; #n = []; #j; constructor(e, t, n, r = null) { if ("string" == typeof e && Number.isInteger(t) && "string" == typeof n) this.#g = e, this.#l = t, this.#i = n, null !== r && (this.#j = r); else throw Error("Illegal Argument (constructor Anime)") } get getNom() { return this.#g } get getId() { return this.#l } get getLien() { return this.#i } getMusic(e) { if (!Number.isInteger(e)) throw Error("illegal Argument (getMusic Method in Class Anime)"); return this.#m[e] } get getNbMusic() { return this.#m.length } getEtatUser(e) { if (!Number.isInteger(e)) throw Error("illegal Argument (getEtatUser Method in Class Anime)"); return this.#n[e] } get getHtml() { return this.#j } generateHTML() { this.#j = new HTMLAnime(this) } ajouteMusic(e) { if (!e instanceof Music) throw Error("illegal Argument (ajouteMusic Method in Class Anime)"); this.#m.push(e) } ajoutePosMusic(e, t) { if (!e instanceof Music || !Number.isInteger(t)) throw Error("illegal Argument (ajouteMusic Method in Class Anime)"); this.#m.splice(t, 0, e) } supprimePosMusic(e) { if (!Number.isInteger(e)) throw Error("illegal Argument (supprimePosMusic Method in Class Anime)"); this.#m.splice(e, 1) } ajouteUser(e) { this.#n.push(e) } copieUsers(anime) { if (!anime instanceof Anime) throw Error("illegal Argument (copieUsers Method in Class Anime)"); for (var i = 0; i < TabStringUsers.length; ++i)eval("this.ajouteUser(anime.getEtatUser(" + i + "));") } } class ListeAnime { #o = []; #p = 0; get getNbAnime() { return this.#o.length } get getNbMusic() { return this.#p } getAnime(e) { return this.#o[e] } generateHTML() { this.#o.forEach(e => { e.generateHTML() }) } ajouteAnime(e) { if (!e instanceof Anime) throw Error("Illegal Argument (ajouteAnime Method in Class ListeAnime)"); this.#o.push(e), this.#p += e.getNbMusic } ajoutePosAnime(e, t) { if (!e instanceof Anime || !Number.isInteger(t)) throw Error("Illegal Argument (ajoutePosAnime Method in Class ListeAnime)"); this.#o.splice(t, 0, e), this.#p += e.getNbMusic } ajoutePosMusic(e, t, n) { if (!t instanceof Music || !Number.isInteger(e) || !Number.isInteger(n)) throw Error("Illegal Argument (ajoutePosMusic Method in Class ListeAnime)"); this.#p++, this.#o[e].ajoutePosMusic(t, n) } supprimePosAnime(e) { if (!Number.isInteger(e)) throw Error("Illegal Argument (supprimePosAnime Method in Class ListeAnime)"); this.#o.splice(e, 1) } supprimePosMusic(e, t) { if (!Number.isInteger(e) || !Number.isInteger(t)) throw Error("Illegal Argument (supprimePosMusic Method in Class ListeAnime)"); this.#o[e].supprimePosMusic(t), this.#p-- } dechargerAllHtml() { this.#o.forEach(e => { e.getHtml.dechargerAll() }) } } async function setupListenersFiltrage() { document.querySelectorAll("input[type='checkbox'], select").forEach(e => { "lecture_auto" != e.id && e.addEventListener("change", async function () { filtre() }) }), document.querySelectorAll("input[type='text']").forEach(e => { e.addEventListener("input", async function () { filtre() }) }), document.querySelector("#favori").addEventListener("click", async function () { affichFav() }), document.querySelector("#save").addEventListener("click", async function () { saveFav() }), document.querySelector("#load").addEventListener("click", async function () { loadFav() }), document.addEventListener("scroll", async function () { if (nbAffich != HTMLTab.length && window.scrollY >= nbPixelAvantUpdate) { for (let e = nbAffich; e < (nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length); ++e)charger(HTMLTab[e]); nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil((nbAffich = nbAffich + 100 < HTMLTab.length ? nbAffich + 100 : HTMLTab.length) / 100) - 1) * 6e3 + 6e3 * (3 / 4)) } }), AudioActuel.addEventListener("ended", function () { if (clickAudio.button.click(), lectureAutomatique) { let e = chercheNextBouton(clickAudio.button); null != e && e.click() } }), inputLectureAuto.addEventListener("click", async function () { lectureAutomatique = !lectureAutomatique }), document.querySelectorAll("input[type='radio']").forEach(e => { e.addEventListener("change", async function () { modifModeAffich() }) }) } async function lancementData() { doCorsRequest("get", "data.json") } async function doCorsRequest(e, t) { let n = new XMLHttpRequest; n.open(e, t), n.onload = n.onerror = function () { let e = n.responseText; genereData(e = JSON.parse(e)) }, n.send() } function genereData(e) { e.anime.forEach(e => { let t = new Anime(correctString(e.nom), e.id, e.lien); e.musique.forEach(e => { let n = new Music(t, e.type, e.numero, correctString(e.nom), correctString(e.artiste), e.lien); t.ajouteMusic(n) }); let n = e.users; TabStringUsers.forEach(e => { t.ajouteUser(1 == n[e]) }), globalList.ajouteAnime(t) }), globalList.generateHTML(), setupAffich(), setupFav(fav, favori) } function genereTabTr(e, t = !0) { let n = [], r = AlternateColor1; for (let s = 0; s < e.getNbAnime; ++s) { e.getAnime(s).getHtml.setBackground(r), r = r == AlternateColor1 ? AlternateColor2 : AlternateColor1, t && n.push(e.getAnime(s).getHtml.getTr); for (let a = 0; a < e.getAnime(s).getNbMusic; ++a)n.push(e.getAnime(s).getMusic(a).getHtml.getTr) } return n } function setupAffich() { let e = document.createElement("div"); e.id = "info"; let t = document.createElement("table"); t.id = "AnimeMusicList", HTMLTab = genereTabTr(globalList); for (let n = 100; n < HTMLTab.length; ++n)decharger(HTMLTab[n]); nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil((nbAffich = HTMLTab.length < 100 ? HTMLTab.length : 100) / 100) - 1) * 6e3 + 6e3 * (3 / 4)); for (let r = 0; r < HTMLTab.length; ++r)t.appendChild(HTMLTab[r]); e.innerHTML = "&nbsp;Nb Anime: " + globalList.getNbAnime + " | Nb Musique: " + globalList.getNbMusic, document.body.appendChild(e), document.body.appendChild(t) } function affichFiltr() { clickAudioStop(); document.getElementById("info").innerHTML = "&nbsp;Nb Anime: " + listeFiltre.getNbAnime + " | Nb Musique: " + listeFiltre.getNbMusic, HTMLTab = genereTabTr(listeFiltre, !AffichageFavori); for (let e = 100; e < HTMLTab.length; ++e)decharger(HTMLTab[e]); nbPixelAvantUpdate = Math.ceil(120 + (Math.ceil((nbAffich = HTMLTab.length < 100 ? HTMLTab.length : 100) / 100) - 1) * 6e3 + 6e3 * (3 / 4)); for (let t = 0; t < nbAffich; ++t)charger(HTMLTab[t]) } function filtreNomAnime(e, t) { for (var n = new ListeAnime, r = 0; r < e.getNbAnime; ++r)e.getAnime(r).getNom.toLowerCase().includes(t.toLowerCase()) ? n.ajouteAnime(e.getAnime(r)) : e.getAnime(r).getHtml.dechargerAll(); return n } function filtreTypeMusic(e, t) { for (var n = new ListeAnime, r = 0; r < e.getNbAnime; ++r) { for (var s = e.getAnime(r), a = new Anime(s.getNom, s.getId, s.getLien, s.getHtml), l = 0; l < s.getNbMusic; ++l)s.getMusic(l).getType == t ? a.ajouteMusic(s.getMusic(l)) : decharger(e.getAnime(r).getMusic(l).getHtml.getTr); a.copieUsers(s), a.getNbMusic > 0 ? n.ajouteAnime(a) : decharger(e.getAnime(r).getHtml.getTr) } return n } function filtreNomMusic(e, t) { for (var n = new ListeAnime, r = 0; r < e.getNbAnime; ++r) { for (var s = e.getAnime(r), a = new Anime(s.getNom, s.getId, s.getLien, s.getHtml), l = 0; l < s.getNbMusic; ++l)s.getMusic(l).getNom.toLowerCase().includes(t.toLowerCase()) ? a.ajouteMusic(s.getMusic(l)) : decharger(e.getAnime(r).getMusic(l).getHtml.getTr); a.copieUsers(s), a.getNbMusic > 0 ? n.ajouteAnime(a) : decharger(e.getAnime(r).getHtml.getTr) } return n } function filtreNomArtistMusic(e, t) { for (var n = new ListeAnime, r = 0; r < e.getNbAnime; ++r) { for (var s = e.getAnime(r), a = new Anime(s.getNom, s.getId, s.getLien, s.getHtml), l = 0; l < s.getNbMusic; ++l)s.getMusic(l).getArtist.toLowerCase().includes(t.toLowerCase()) ? a.ajouteMusic(s.getMusic(l)) : decharger(e.getAnime(r).getMusic(l).getHtml.getTr); a.copieUsers(s), a.getNbMusic > 0 ? n.ajouteAnime(a) : decharger(e.getAnime(r).getHtml.getTr) } return n } function filtreUsersUnion(listeFiltreAnime) { for (var i = 0; i < TabStringUsers.length; ++i)eval("var val" + i + " = " + TabStringUsers[i] + ".checked"); for (var listeA = new ListeAnime, i = 0; i < listeFiltreAnime.getNbAnime; ++i) { for (var stop = !1, j = 0; j < TabStringUsers.length && !stop;)eval("if(val" + j + "==true && listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;"), stop ? listeA.ajouteAnime(listeFiltreAnime.getAnime(i)) : j++; stop || listeFiltreAnime.getAnime(i).getHtml.dechargerAll() } return listeA } function filtreUsersIntersection(listeFiltreAnime) { for (var i = 0; i < TabStringUsers.length; ++i)eval("var val" + i + " = " + TabStringUsers[i] + ".checked"); for (var listeA = new ListeAnime, i = 0; i < listeFiltreAnime.getNbAnime; ++i) { for (var stop = !1, j = 0; j < TabStringUsers.length && !stop;)eval("if(val" + j + "==true && !listeFiltreAnime.getAnime(" + i + ").getEtatUser(" + j + ")) stop = true;"), j++; stop ? listeFiltreAnime.getAnime(i).getHtml.dechargerAll() : listeA.ajouteAnime(listeFiltreAnime.getAnime(i)) } return listeA } function filtre() { let e = globalList; AffichageFavori = !1; let t = filtreJointureSelect.value; e = "Union" == t ? filtreUsersUnion(e) : filtreUsersIntersection(e), "" != (t = correctString(filtreNomAnimeInput.value)) && (e = filtreNomAnime(e, t)), "" != (t = filtreTypeMusicSelect.value) && (e = filtreTypeMusic(e, t)), "" != (t = correctString(filtreNomMusicInput.value)) && (e = filtreNomMusic(e, t)), "" != (t = correctString(filtreNomArtistInput.value)) && (e = filtreNomArtistMusic(e, t)), listeFiltre = e, affichFiltr() } async function resetFiltre() { for (var i of ("2" == ModeAffichLien && (AffichLien2.checked = !0), filtreNomAnimeInput.value = "", filtreTypeMusicSelect.value = "", filtreNomMusicInput.value = "", filtreNomArtistInput.value = "", filtreJointureSelect.value = "Union", TabStringUsers)) eval(i + ".checked = true") } function chercheNextBouton(e) { let t = e.parentElement.parentElement.nextElementSibling; for (; null != t && (t.classList.contains("grey") || "none" == t.style.display);)t = t.nextElementSibling; return null != t ? t.querySelector("button") : HTMLTab.length > 0 ? HTMLTab[0].classList.contains("grey") ? HTMLTab[1].querySelector("button") : HTMLTab[0].querySelector("button") : null } function clickAudio(e, t) { AudioActuel.src != e ? (AudioActuel.pause(), void 0 !== clickAudio.button && (clickAudio.button.innerHTML = "&#9658;"), AudioActuel.src = e, AudioActuel.play(), t.innerHTML = "&#9208;", stateAudio = 1) : 1 == stateAudio ? (AudioActuel.pause(), t.innerHTML = "&#9658;", stateAudio = 0) : (AudioActuel.play(), t.innerHTML = "&#9208;", stateAudio = 1), clickAudio.button = t } function clickAudioStop() { void 0 != clickAudio.button && (clickAudio.button.innerHTML = "&#9658", clickAudio.button = void 0, AudioActuel.pause(), stateAudio = 0) } function modifModeAffich() { ModeAffichLien = AffichLien1.checked ? AffichLien1.value : AffichLien2.value, localStorage.setItem("modeAffichLien", ModeAffichLien), location.reload() } async function setupFavori() { if (localStorage.getItem("favori")) { favori = localStorage.getItem("favori").split("|"); for (var e = 0; e < favori.length;)favori[e].startsWith("https://") ? e++ : favori.splice(e, 1); let t = favori.join("|"); localStorage.setItem("favori", t) } else localStorage.setItem("favori", favori) } async function saveFav() { let e = document.createElement("a"); var t = prompt("Nom du fichier : ", "SaveFav.txt"); null == t && (t = "saveFav.txt"), e.download = t, e.href = "data:text/plain," + localStorage.getItem("favori"), document.body.appendChild(e), e.click(), document.body.removeChild(e) } async function loadFav() { let e = document.createElement("input"); e.type = "file", e.onchange = function () { let t = e.files[0], n = new FileReader; n.onload = e => { localStorage.setItem("favori", e.target.result), location.reload() }, n.readAsText(t) }, document.body.appendChild(e), e.click(), document.body.removeChild(e) } async function sauvegardeFav() { for (var e = [], t = 0; t < fav.getNbAnime; ++t)for (var n = 0; n < fav.getAnime(t).getNbMusic; ++n)e.push(fav.getAnime(t).getMusic(n).getLien); var r = e.join("|"); localStorage.setItem("favori", r) } function posAnime(e, t) { if (0 == t.getNbAnime) return -1; for (var n, r = 0, s = t.getNbAnime; r < s;)n = Math.trunc((r + s) / 2), t.getAnime(n).getNom.toLowerCase() > e.getNom.toLowerCase() ? s = n : t.getAnime(n).getNom.toLowerCase() < e.getNom.toLowerCase() ? r = n + 1 : t.getAnime(n).getId > e.getId ? s = n : t.getAnime(n).getId < e.getId ? r = n + 1 : (r = n, s = n); return r } function posMusic(e, t, n) { for (var r = 0, s = 0; s < n.getNbMusic; ++s) { if (e.getLien == n.getMusic(s).getLien) return r; r < t.getNbMusic && t.getMusic(r).getLien == n.getMusic(s).getLien && r++ } return -1 } function identiqueAnime(e, t) { return e.getNom == t.getNom && e.getId == t.getId } async function ajoutFav(e, t) { var n = posAnime(e, fav); if (-1 != n && n != fav.getNbAnime && identiqueAnime(fav.getAnime(n), e)) { var r = posMusic(t, fav.getAnime(n), e); r > -1 && fav.ajoutePosMusic(n, t, r) } else { var s = new Anime(e.getNom, e.getId, e.getLien, e.getHtml); s.ajouteMusic(t), fav.ajoutePosAnime(s, n) } } async function suppFav(e, t) { var n = posAnime(e, fav), r = posMusic(t, fav.getAnime(n), fav.getAnime(n)); fav.supprimePosMusic(n, r), 0 == fav.getAnime(n).getNbMusic && fav.supprimePosAnime(n) } function modifFav(e, t, n) { n ? ajoutFav(e, t) : suppFav(e, t), AffichageFavori && (AffichageFavori = !AffichageFavori, affichFav()), sauvegardeFav() } function setupFav(e, t) { if (0 == t.length) return; let n = 0; for (let r = 0; r < globalList.getNbAnime && n < t.length; ++r) { let s = new Anime(globalList.getAnime(r).getNom, globalList.getAnime(r).getId, globalList.getAnime(r).getLien, globalList.getAnime(r).getHtml); for (let a = 0; a < globalList.getAnime(r).getNbMusic && n < t.length; ++a)globalList.getAnime(r).getMusic(a).getLien == t[n] && (s.ajouteMusic(globalList.getAnime(r).getMusic(a)), globalList.getAnime(r).getMusic(a).getHtml.getTd(0).innerHTML = "&#9733;", n++); s.getNbMusic > 0 && e.ajouteAnime(s) } fav.getNbMusic != favori.length && repareFav() } async function affichFav() { resetFiltre(), AffichageFavori ? (AffichageFavori = !1, listeFiltre = globalList) : (AffichageFavori = !0, listeFiltre = fav), globalList.dechargerAllHtml(), affichFiltr() } function chercheMusique(e) { for (let t = 0; t < globalList.getNbAnime; ++t)for (let n = 0; n < globalList.getAnime(t).getNbMusic; ++n)if (globalList.getAnime(t).getMusic(n).getLien == e) return globalList.getAnime(t).getMusic(n); return null } function repareFav() { let e = 0; for (let t = 0; t < favori.length; ++t) { let n = chercheMusique(favori[t]); null == n ? e++ : n.getHtml.getTd(0).innerHTML == falseTd.innerHTML && ajoutFav(n.getAnime, n) } if (fav.getNbMusic != favori.length - e) throw Error("repareFav don't working"); sauvegardeFav(), location.reload() } Object.seal(HTMLMusic), Object.seal(Music), Object.seal(HTMLAnime), Object.seal(Anime), Object.seal(ListeAnime); const TabStringUsers = ["A", "C", "L", "V", "T"]; let globalList = new ListeAnime, fav = new ListeAnime, listeFiltre = globalList, AlternateColor1 = "lightgreen", AlternateColor2 = "lightcoral", HTMLTab, nbAffich = 0, nbPixelAvantUpdate = 120, filtreNomAnimeInput = document.getElementById("name_anime"), filtreTypeMusicSelect = document.getElementById("type_music"), filtreNomMusicInput = document.getElementById("name_music"), filtreNomArtistInput = document.getElementById("name_artist"), filtreJointureSelect = document.getElementById("jointure"); for (var i of TabStringUsers) eval("let " + i + ' = document.getElementById("' + i + '");'); let AudioActuel = new Audio(""), stateAudio = 0, inputLectureAuto = document.querySelector("#lecture_auto"), lectureAutomatique = inputLectureAuto.checked, AffichLien1 = document.getElementById("affich_lien1"), AffichLien2 = document.getElementById("affich_lien2"), ModeAffichLien = "1"; localStorage.getItem("modeAffichLien") ? ModeAffichLien = localStorage.getItem("modeAffichLien") : localStorage.setItem("modeAffichLien", ModeAffichLien); let AffichageFavori = !1, favori = []; !async function () { resetFiltre().then(setupFavori()).then(lancementData()).then(setupListenersFiltrage()) }();