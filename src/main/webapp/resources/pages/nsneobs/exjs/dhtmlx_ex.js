function eXcell_dyngnum(a) {
	this.base = eXcell_ed;
	this.base(a);
	/*
	if(this.grid){
		//alert("this.grid is not null，entBox.sv ="+$("#"+this.grid.entBox.id).attr('sv'));
	}*/
	this.getValue = function() {
		return this.cell.firstChild.innerHTML.toString()._dhx_trim()
	}
}
eXcell_dyngnum.prototype = new eXcell_ed;
eXcell_dyngnum.prototype.setValue = function(g) {
	if (!g || isNaN(Number(g))) {
		if (g !== "") {
			g = 70
		}
	}
	
	var dmax = 70;
	if(this.grid){
		//alert("this.grid is not null，entBox.dyngnum="+$(this.grid.entBox).attr("dyngnum"));
		//alert("this.cell._cellIndex="+this.cell._cellIndex);
		//alert("this.cell.parentNode.idd="+this.cell.parentNode.idd);
		//alert("this.grid.rowindex="+this.grid.getRowIndex(this.cell.parentNode.idd));
		var s =$(this.grid.entBox).attr("dyngnum");
		if(s&&s!=""){
			dmax = Number(s);
		}
	}
	
	//alert("dmax="+dmax)
	
	if (g > dmax) {
		var c = "green";
		//var a = "dyn_up.gif"
	} else {
		if (g == dmax) {
			var c = "black";
			//var a = "dyn_.gif"
		} else {
			var c = "red";
			//var a = "dyn_down.gif"
		}
	}
	this.setCValue("<span style='width:100%;color:" + c + ";'>" + g + "</span>", g)
};


/***********************************************************************************************************************/

function eXcell_divrostr(a) {
	this.base = eXcell_ro;
	this.base(a);
	this.getValue = function() {
		return this.cell.firstChild.innerHTML.toString()._dhx_trim()
	}
}
eXcell_divrostr.prototype = new eXcell_ro;
eXcell_divrostr.prototype.setValue = function(g) {
	this.setCValue("<span textValue='"+g+"'>" + g + "</span>", g);
};

/***********************************************************************************************************************/


function eXcell_divrocheckbox(a) {
	this.base = eXcell_ro;
	this.base(a);
	this.getValue = function() {
		return $(this.cell.firstChild).val();
	}
}
eXcell_divrocheckbox.prototype = new eXcell_ro;
eXcell_divrocheckbox.prototype.setValue = function(g) {

	this.setCValue("<input type='checkbox' value='"+g+"' class='dhtmlx-gridcheckbox'>", g);
};
/***********************************************************************************************************************/
/**操作按钮组
 * 在表格初始化的时候可以使用一下方法添加
 * $('.nsneo-btn-gridover').click(function(){
								alert($(this).parent().data('mapid'));
							})


 $.getJSON("./datas/index_maintable.json", function(result){
						    myGrid = new dhtmlXGridObject('gridbox');
							myGrid.setImagePath(result.imagePath);

							myGrid.setHeader(result.header);
							//myGrid.attachHeader(result.attachHeader);
							myGrid.setInitWidths(result.initWidths);
							myGrid.setColAlign(result.colAlign);
							myGrid.setColTypes(result.colTypes);
							myGrid.setColSorting(result.colSorting);
							myGrid.init();

							myGrid.parse(result.data, function(){
								myGrid.selectRowById(1);
							},"json");

							$('.hdrcell').css("text-align", "center");
							$(".hdr").find("td").css("vertical-align", "middle");


							$('.dhtmlx-nsneo-btngroup').html(
								'<button type="button" class="nsneo-btn-gridover">结束</button>'
							);

							$('.nsneo-btn-gridover').click(function(){
								alert($(this).parent().data('mapid'));
							})
						});
 * */
function eXcell_nsneobtngroup(a) {
    this.base = eXcell_ro;
    this.base(a);
    this.getValue = function() {
        return $(this.cell.firstChild).val();
    }
}
eXcell_nsneobtngroup.prototype = new eXcell_ro;
eXcell_nsneobtngroup.prototype.setValue = function(g) {

    //this.setCValue("<input type='button' value='"+g+"' class='dhtmlx-nsneo-gridbutton'>", g);

    this.setCValue('<div class="dhtmlx-nsneo-btngroup" data-mapid="'+g+'"></div>', g);
};


/***********************************************************************************************************************/


/***********************************************************************************************************************/


/***********************************************************************************************************************/

function eXcell_treero(a) {
	if (a) {
		this.cell = a;
		this.grid = this.cell.parentNode.grid
	}
	this.isDisabled = function() {
		return this.cell._disabled || this.grid._edtc
	};
	this.edit = function() {};
	this.detach = function() {
		if (!this.er) {
			return
		}
		this.setLabel(this.er.firstChild.value);
		this.er.className = this.er.className.replace("editable", "");
		var c = (this.val != this.er.innerHTML);
		this.obj = this.er = null;
		return (c)
	};
	this.getValue = function() {
		return this.getLabel()
	};
	this.setImage = function(c) {
		this.cell.parentNode.imgTag.nextSibling.src = this.grid.iconURL + c;
		this.grid._h2.get[this.cell.parentNode.idd].image = c
	};
	this.getImage = function() {
		return this.grid._h2.get[this.cell.parentNode.idd].image
	};
	this.setLabel = function(c) {
		this.setValueA(c)
	};
	this.getLabel = function(c) {
		return this.cell.parentNode.valTag.innerHTML
	}
}
eXcell_treero.prototype = new eXcell;

eXcell_treero.prototype.setValue = function(a) {
	if (this.cell.parentNode.imgTag) {
		return this.setLabel(a)
	}

	if ((this.grid._tgc.iconTree == null) || (this.grid._tgc.iconTree != this.grid.iconTree)) {
		var m = {};
		m.spacer = "<img src='" + this.grid.iconTree + "blank.gif'  align='top' class='space'>";
		
		//modify code by zzm 20160827
		m.imst = "<img class='treegrid_cell_itemimg_tree' style='margin-top:-2px;' src='" + this.grid.iconTree;
		m.imsti = "<img class='treegrid_cell_itemimg' style='padding-top:2px;'  src='" + (this.grid.iconURL || this.grid.iconTree);
		m.imact = "' class='treegrid_cell_itemimg_head' align='top' onclick='this." + (_isKHTML ? "" : "parentNode.") + "parentNode.parentNode.parentNode.parentNode.grid.doExpand(this);event.cancelBubble=true;'>";
		m.plus = m.imst + "plus.gif" + m.imact;
		m.minus = m.imst + "minus.gif" + m.imact;
		m.blank = m.imst + "blank.gif" + m.imact;
		m.start = "<div class='treegrid_cell' style='overflow:hidden; white-space : nowrap; line-height:23px; height:" + (_isIE ? 21 : 23) + "px;'>";
		m.itemim = "' align='top' " + (this.grid._img_height ? (' height="' + this.grid._img_height + '"') : "") + (this.grid._img_width ? (' width="' + this.grid._img_width + '"') : "") + " ><span id='nodeval'>";
		m.close = "</span></div>";
		this.grid._tgc = m
	}
	var n = this.grid._h2;
	var m = this.grid._tgc;
	var l = this.cell.parentNode.idd;
	var o = this.grid._h2.get[l];
	if (this.grid.kidsXmlFile || this.grid._slowParse) {
		o.has_kids = (o.has_kids || (this.cell.parentNode._attrs.xmlkids && (o.state != "minus")));
		o._xml_await = !!o.has_kids
	}
	//o.image = o.image || (this.cell._attrs.image || "leaf.gif");

	o.image = o.image || this.cell._attrs.image;

	o.label = a;
	var g = [m.start];
	for (var c = 0; c < o.level; c++) {
		g.push(m.spacer)
	}
	if (o.has_kids) {
		g.push(m.plus);
		o.state = "plus"
	} else {
		g.push(m.imst + o.state + ".gif" + m.imact)
	}

	if(o.image){
		g.push(m.imsti);
		g.push(o.image);
		g.push(m.itemim);
	}


	g.push(o.label);
	g.push(m.close);
	this.cell.innerHTML = g.join("");
	this.cell._treeCell = true;
	this.cell.parentNode.imgTag = this.cell.childNodes[0].childNodes[o.level];
	this.cell.parentNode.valTag = this.cell.childNodes[0].childNodes[o.level + 2];
	if (_isKHTML) {
		this.cell.vAlign = "top"
	}

	/*
	for(var x in o){
		alert('x='+x+",xv="+o[x]);
	}
	for(var x in o.parent){
		alert('x='+x+",xv="+o.parent[x]);
	}*/
	if (o.parent.id != 0 && o.parent.state == "plus") {
		this.grid._updateTGRState(o.parent, false);
		this.cell.parentNode._skipInsert = true
	}
	this.grid.callEvent("onCellChanged", [l, this.cell._cellIndex, a])
};

/***********************************************************************************************************************/

dhtmlXGridObject.prototype.toExcelforNsneo = function(a, l, o, n, c) {
	if (!document.getElementById("ifr")) {
		var m = document.createElement("iframe");
		m.style.display = "none";
		m.setAttribute("name", "dhx_export_iframe");
		m.setAttribute("src", "");
		m.setAttribute("id", "dhx_export_iframe");
		document.body.appendChild(m)
	}
	var g = ' target="dhx_export_iframe"';
	
	this.toPDFforNsneo(a, l, o, n, c, g);
	
};



dhtmlXGridObject.prototype.toPDFforNsneo = function(l, s, x, v, q, D) {
	var m = {
		row: this.getSelectedRowId(),
		col: this.getSelectedCellIndex()
	};
	if (m.row === null || m.col === -1) {
		m = false
	} else {
		if (m.row && m.row.indexOf(this.delim) !== -1) {
			var c = this.cells(m.row, m.col).cell;
			c.parentNode.className = c.parentNode.className.replace(" rowselected", "");
			c.className = c.className.replace(" cellselected", "");
			m.el = c
		} else {
			m = false
		}
	}
	s = s || "color";
	var y = s == "full_color";
	var a = this;
	a._asCDATA = true;
	if (typeof(D) === "undefined") {
		this.target = ' target="_blank"'
	} else {
		this.target = D
	}
	eXcell_ch.prototype.getContent = function() {
		return this.getValue()
	};
	eXcell_ra.prototype.getContent = function() {
		return this.getValue()
	};

	function C(H) {
		var N = [];
		for (var L = 1; L < a.hdr.rows.length; L++) {
			N[L] = [];
			for (var K = 0; K < a._cCount; K++) {
				var P = a.hdr.rows[L].childNodes[K];
				if (!N[L][K]) {
					N[L][K] = [0, 0]
				}
				if (P) {
					N[L][P._cellIndexS] = [P.colSpan, P.rowSpan]
				}
			}
		}
		var M = "<rows profile='" + H + "'";
		if (x) {
			M += " header='" + x + "'"
		}
		if (v) {
			M += " footer='" + v + "'"
		}
		M += "><head>" + a._serialiseExportConfig(N).replace(/^<head/, "<columns").replace(/head>$/, "columns>");
		for (var L = 2; L < a.hdr.rows.length; L++) {
			var E = 0;
			var T = a.hdr.rows[L];
			var O = "";
			for (var K = 0; K < a._cCount; K++) {
				if ((a._srClmn && !a._srClmn[K]) || (a._hrrar[K] && (!a._fake || K >= a._fake.hdrLabels.length))) {
					E++;
					continue
				}
				var S = N[L][K];
				var Q = ((S[0] && S[0] > 1) ? ' colspan="' + S[0] + '" ' : "");
				if (S[1] && S[1] > 1) {
					Q += ' rowspan="' + S[1] + '" ';
					E = -1
				}
				var F = "";
				var J = T;
				if (a._fake && K < a._fake._cCount) {
					J = a._fake.hdr.rows[L]
				}
				for (var I = 0; I < J.cells.length; I++) {
					if (J.cells[I]._cellIndexS == K) {
						if (J.cells[I].getElementsByTagName("SELECT").length) {
							F = ""
						} else {
							F = _isIE ? J.cells[I].innerText : J.cells[I].textContent
						}
						F = F.replace(/[ \n\r\t\xA0]+/, " ");
						break
					}
				}
				if (!F || F == " ") {
					E++
				}
				O += "<column" + Q + "><![CDATA[" + F + "]]></column>"
			}
			if (E != a._cCount) {
				M += "\n<columns>" + O + "</columns>"
			}
		}
		M += "</head>\n";
		M += r();
		return M
	}

	function g() {
		var E = [];
		if (q) {
			for (var F = 0; F < q.length; F++) {
				E.push(w(a.getRowIndex(q[F])))
			}
		} else {
			for (var F = 0; F < a.getRowsNum(); F++) {
				E.push(w(F))
			}
		}
		return E.join("\n")
	}

	function r() {
		var H = ["<foot>"];
		if (!a.ftr) {
			return ""
		}
		for (var I = 1; I < a.ftr.rows.length; I++) {
			H.push("<columns>");
			var L = a.ftr.rows[I];
			for (var F = 0; F < a._cCount; F++) {
				if (a._srClmn && !a._srClmn[F]) {
					continue
				}
				if (a._hrrar[F] && (!a._fake || F >= a._fake.hdrLabels.length)) {
					continue
				}
				for (var E = 0; E < L.cells.length; E++) {
					var K = "";
					var J = "";
					if (L.cells[E]._cellIndexS == F) {
						K = _isIE ? L.cells[E].innerText : L.cells[E].textContent;
						K = K.replace(/[ \n\r\t\xA0]+/, " ");
						if (L.cells[E].colSpan && L.cells[E].colSpan != 1) {
							J = " colspan='" + L.cells[E].colSpan + "' "
						}
						if (L.cells[E].rowSpan && L.cells[E].rowSpan != 1) {
							J = " rowspan='" + L.cells[E].rowSpan + "' "
						}
						break
					}
				}
				H.push("<column" + J + "><![CDATA[" + K + "]]></column>")
			}
			H.push("</columns>")
		}
		H.push("</foot>");
		return H.join("\n")
	}

	function o(F, E) {
		return (window.getComputedStyle ? (window.getComputedStyle(F, null)[E]) : (F.currentStyle ? F.currentStyle[E] : null)) || ""
	}

	function w(I) {
		if (!a.rowsBuffer[I]) {
			return ""
		}
		var E = a.render_row(I);
		if (E.style.display == "none") {
			return ""
		}
		var F = a.isTreeGrid() ? ' level="' + a.getLevel(E.idd) + '"' : "";
		var M = "<row" + F + ">";
		for (var K = 0; K < a._cCount; K++) {
			if (((!a._srClmn) || (a._srClmn[K])) && (!a._hrrar[K] || (a._fake && K < a._fake.hdrLabels.length))) {
				var Q = a.cells(E.idd, K);
				if (y) {
					var J = o(Q.cell, "color");
					var P = o(Q.cell, "backgroundColor");
					var O = o(Q.cell, "font-weight") || o(Q.cell, "fontWeight");
					var L = o(Q.cell, "font-style") || o(Q.cell, "fontStyle");
					var N = o(Q.cell, "text-align") || o(Q.cell, "textAlign");
					var H = o(Q.cell, "font-family") || o(Q.cell, "fontFamily");
					if (P == "transparent" || P == "rgba(0, 0, 0, 0)") {
						P = "rgb(255,255,255)"
					}
					M += "<cell bgColor='" + P + "' textColor='" + J + "' bold='" + O + "' italic='" + L + "' align='" + N + "' font='" + H + "'>"
				} else {
					M += "<cell>"
				}
				/*
				var t = (Q.getContent ? Q.getContent() : Q.getTitle());
				if($.trim(t)==''){
					//M += "<![CDATA[" + (Q.getContent ? Q.getContent() : Q.getTitle()) + "]]></cell>"
					M += t+"</cell>"
				}else{
					M += "</cell>"
				}*/
				M += "<![CDATA[" + (Q.getContent ? Q.getContent() : Q.getTitle()) + "]]></cell>"
				
			}
		}
		return M + "</row>"
	}

	function u() {
		var E = "</rows>";
		return E
	}
	var A = document.createElement("div");
	A.style.display = "none";
	document.body.appendChild(A);
	var n = "form_" + a.uid();
	//modify code by zzm 20160727 submit textarea replace input
	//A.innerHTML = '<form id="' + n + '" method="post" action="' + l + '" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded"' + this.target + '><input type="hidden" name="grid_xml" id="grid_xml"/> </form>';
	//document.getElementById(n).firstChild.value = encodeURIComponent(C(s).replace("\u2013", "-") + g() + u());
	
	//A.innerHTML = '<form id="' + n + '" method="post" accept-charset="utf-8" enctype="application/x-www-form-urlencoded" action="' + l + '" ' + this.target + '>'
	//A.innerHTML = '<form id="' + n + '" method="post" enctype="multipart/form-data" action="' + l + '" ' + this.target + '>'
	A.innerHTML = '<form id="' + n + '" method="post" accept-charset="utf-8" enctype="application/x-www-form-urlencoded" action="' + l + '" ' + this.target + '>'
	+'<textarea style="display:none" name="grid_xml" id="grid_xml"></textarea>'
	+'</form>';
	
	//var ghtml = ;
	//alert("c长度:"+C(s).replace("\u2013", "-").length);
	//alert("g长度:"+ghtml.length);
	//alert("u长度:"+u().length);
	
	document.getElementById(n).firstChild.value = C(s).replace("\u2013", "-") + g() + u();
	//document.getElementById('grid_xml').value = C(s).replace("\u2013", "-") + ghtml.substring(0,600000) + u();
	//document.getElementById('grid_xml_2').value = C(s).replace("\u2013", "-") + ghtml.substring(600000,1200000) + u();
	
	document.getElementById(n).submit();
	A.parentNode.removeChild(A);
	a = null;
	if (m) {
		m.el.parentNode.className += " rowselected";
		m.el.className += " cellselected"
	}
	m = null
	
};


/***********************************************************************************************************************/
/**
 * 调用 dhtmlx 的 toExcel 函数产生excel文件
 * */
function openToExcelforNsneo(_dxGridObj,url,openLayer,closeLayer){

	
	if(typeof(openLayer) == 'undefined'||openLayer==null){
    	openLayer = true;
    }
    
    if(typeof(openLayer) == 'undefined'||closeLayer==null){
    	closeLayer = true;
    }
    
	if(openLayer){
    	loadSysMaskLayer();
    }
	
	var timeOutId = null;
	try{
		timeOutId =setTimeout(function(){
			//alert('1秒后弹框');
			_dxGridObj.toExcelforNsneo(url);
			
			try{
	        	clearTimeout(timeOutId)
	        }catch(ef){}
	        
	        if(closeLayer){
				closeSysMaskLayer();
			}
			
		},2000);
    }catch(e){
    	alert(e);

        try{
        	clearTimeout(timeOutId)
        }catch(ef){}
        
        if(closeLayer){
        	closeSysMaskLayer();
        }
    }
    
	
}

