/**
 数据格式
{
				id: "001",
				name: "XXX厂-XXX线-XXX工位信息设置",
				caption: "",
				children: [{
						id: "001-001",
						name: "操作设备的控制按钮",
						type: "",
						caption: "操作设备的控制按钮的描述信息",
						icon: "fa fa-glass",
						children: [{
								id: "001-001-001",
								name: "单片塞尺",
								type: "",
								caption: "单片塞尺的描述信息",
								icon: "fa fa-glass",
								children: []
							},
							{
								id: "001-001-002",
								name: "夹具",
								type: "",
								caption: "夹具的描述信息",
								icon: "fa fa-glass",
								children: [{
										id: "001-001-002-001",
										name: "进气阀座",
										type: "",
										caption: "进气阀座的描述信息",
										icon: "fa fa-glass",
										children: []
									},
									{
										id: "001-001-002-002",
										name: "气门导管",
										type: "",
										caption: "气门导管的描述信息",
										icon: "fa fa-glass",
										children: []
									}
								]
							}
						]
					},
					{
						id: "001-002",
						name: "清除铁屑、切屑液",
						type: "",
						caption: "清除铁屑、切屑液的描述信息",
						icon: "fa fa-glass",
						children: []
					},
					{
						id: "001-003",
						name: "设备间走路移动时间",
						type: "",
						caption: "设备间走路移动时间的描述信息",
						icon: "fa fa-glass",
						children: []
					},
					{
						id: "001-004",
						name: "首件自检",
						type: "",
						caption: "首件自检的描述信息",
						icon: "fa fa-glass",
						children: []
					},
					{
						id: "001-005",
						name: "压装导管、阀座",
						type: "",
						caption: "压装导管、阀座的描述信息",
						icon: "fa fa-glass",
						children: [{
							id: "001-005-001",
							name: "导管压头",
							type: "",
							caption: "导管压头的描述信息",
							icon: "fa fa-glass",
							children: []
						}]
					}
				],
			}
					
 调用方式：
 
 function settingFinderColunmViewAreaHeight() {
				var height = $("#page-wrapper").height() - $('#page-title').height() - 80;
				console.log('edit height=' + height);
				fcv_ResettingAreaHeight(height);
			}

			function fcv_ResettingAreaHeight(height) {
				$('.finder-columnview-resizablearea').height(height);
				$('.finder-columnview-resizablearea').css("min-height", height + "px");
				$('.finder-columnview-resizablearea').css("max-height", height + "px");
				$('.finder-columnview-listarea').height(height);
				$('.finder-columnview-listarea').css("min-height", height + "px");
				$('.finder-columnview-listarea').css("max-height", height + "px");
			}
 
$.getJSON("./data/gongwei_setting_device-data.json", function(result) {
					jsonObj = result;
					
					//激活根选择信息
					$("#div-root-title").find(".panel-with-button-title-span").html(jsonObj.name);
					$("#div-root-title").removeClass('finder-columnview-title-selected');
					$("#div-root-title").addClass('finder-columnview-title-selected');
					
					fvcview = $('#finder-columnview-container').FinderColumnView({
						firstLevelJsonDatas: findJsonArrayData('-', findJsonRootData()),
						findChildItemFun: function(triggerLI, fcvObj, voptions) {
							//找到子节点函数
							return findJsonArrayData(triggerLI.data('fcvrowid'), findJsonRootData());;
						},
						itemClickFun: function(triggerLI, fcvObj, voptions) {
							//项目点击触发函数
							console.log('点击节点:'+triggerLI.data('fcvrowid'));
							$("#div-root-title").removeClass('finder-columnview-title-selected');
						},
						refreshColumSize:function(){
							settingFinderColunmViewAreaHeight();
						}
					});
				});

				
 * */

(function($) {
	$.fn.extend({
		"FinderColumnView": function(options) {
			options = $.extend({
				firstLevelJsonDatas: [],
				settingHeight: function(height) {
					$('.finder-columnview-resizablearea').height(height);
					$('.finder-columnview-resizablearea').css("min-height", height + "px");
					$('.finder-columnview-resizablearea').css("max-height", height + "px");
					$('.finder-columnview-listarea').height(height);
					$('.finder-columnview-listarea').css("min-height", height + "px");
					$('.finder-columnview-listarea').css("max-height", height + "px");
				},
				settingWidth: function(width) {
					$('.finder-columnview-resizablearea').width(width);
					$('.finder-columnview-resizablearea').css("min-width", height + "px");
				},
				itemClickFun: function(triggerLI, fcvObj, voptions) {
					//项目点击触发函数
					//$("#div-root-title").removeClass('finder-columnview-title-selected');
					if(triggerLI.data('childrennum') == "0") {
						console.log('输出本节点的数据信息...');
					} else {
						//重置尺寸
						//settingFinderColunmViewAreaHeight();
						console.log('重置尺寸...');
					}
				},
				findChildItemFun: function(triggerLI, fcvObj, voptions) {
					//找到子节点函数
					return [];
				},async:false,
				drawChildColumnRowView:function(children,triggerLI, fcvObj, voptions){
					//找到子节点
						//var children = voptions.findChildItemFun(triggerLI, fcvObj, voptions);
						//console.log(triggerLI.data('fcvrowid') + ',children.length=' + children.length);
						
					
						//增加子节点
						var childrenHtml = voptions.buildColumnView(triggerLI.data('fcvrowid'), children, voptions,triggerLI.data('fcvtype'),triggerLI.data('fcvdomain'));

						//console.log(triggerLI.parents('td:first').length);
						triggerLI.parents('td:first').after(childrenHtml);

						//设置尺寸
						//settingFinderColunmViewAreaHeight()

						//设置提示内容
						//fcvObj.find('[data-toggle="tooltip"]').tooltip();
						//设置尺寸缩放
						fcvObj.find('.finder-columnview-resizablearea').resizable({ autoHide: true });

						//重新绑定激活函数
						fcvObj.find('.finder-columnview-list-group-item').unbind('click');
						fcvObj.find('.finder-columnview-list-group-item').click(function() {
							//console.log('点击li id=:' + $(this).data('fcvrowid'));
							voptions.bindClickFun($(this), fcvObj, voptions,$(this).data('fcvtype'),$(this).data('fcvdomain'));
						})

						//重置尺寸
						voptions.refreshColumSize();
						
						
						//触发外部实现函数
						voptions.itemClickFun(triggerLI, fcvObj, voptions);
				},
				drawColumnRowView: function(parentId,rowObj) {
					var sb = new StringBuffer();
					
					var strtype = '';
					if(rowObj.type&&$.trim(rowObj.type)!=''){
						strtype = rowObj.type;
					}
					
					var strdomain = '';
					if(rowObj.domain&&$.trim(rowObj.domain)!=''){
						strdomain = rowObj.domain;
					}
					
					sb.append('<li id="fvcrowid_'+rowObj.id+'" data-fcvparentid="'+parentId+'" data-fcvrowid="' + rowObj.id + '" data-fcvname="'+rowObj.name+'" data-fcvtype="'+strtype+'" data-fcvdomain="'+strdomain+'" class="list-group-item finder-columnview-list-group-item" ');
					if(rowObj.children && rowObj.children.length > 0) {
						sb.append(' data-childrennum="' + rowObj.children.length + '" ');
					} else {
						if(rowObj.hasChildren) {
							sb.append(' data-childrennum="1" ');
						} else {
							sb.append(' data-childrennum="0" ');
						}

					}
					if(rowObj.caption&&$.trim(rowObj.caption)!='') {
						sb.append(' data-toggle="tooltip" data-placement="right" title="' + rowObj.caption + '" ');
					}
					sb.append('>');

					//强制增加子列
					if(rowObj.hasChildren) {
						sb.append('<span class="finder-columnview-list-group-item-nexticon"><i class="fa fa-chevron-right "></i></span>');
					} else {
						if(rowObj.children && rowObj.children != null && rowObj.children.length > 0) {
							sb.append('<span class="finder-columnview-list-group-item-nexticon"><i class="fa fa-chevron-right "></i></span>');
						}
					}

					if(rowObj.icon) {
						sb.append('<span class="finder-columnview-list-group-item-selficon"><i class="' + rowObj.icon + '"></i></span>');
					} else {
						sb.append('<span class="finder-columnview-list-group-item-selficon"><i class="fa fa-glass"></i></span>');
					}
					
					//设置值内容
					if(rowObj.value){
						sb.append('<span class="finder-columnview-list-group-item-value">'+rowObj.value+'</span>');
					}
					
					

					sb.append(rowObj.name);
					
					
					sb.append('</li>');

					return sb.toString();
				},
				buildColumnView: function(parentid, jsonArrayObj, voptions,coltype,coldomain) {
					//构建视图html

					var sb = new StringBuffer();
					
					var strtype = '';
					if(coltype&&$.trim(coltype)!=''){
						strtype = coltype;
					}
					
					var strdomain = '';
					if(coldomain&&$.trim(coldomain)!=''){
						strdomain = coldomain;
					}
					
					sb.append('<td data-fcvcolid="' + parentid + '" data-fcvtype="'+strtype+'" data-fcvdomain="'+strdomain+'"><div class="finder-columnview-resizablearea ">');
					
					//此处添加列标题数据
					//sb.append('<div class="finder-columnview-ui-widget-header">可改变尺寸区域1</div>');
					sb.append(voptions.appendHeader(parentid, jsonArrayObj, voptions,coltype,coldomain));
					
					//sb.append('<div class="finder-columnview-listarea"><ul class="list-group finder-columnview-list-group">');
					sb.append('<div class="finder-columnview-listarea finder-columnview-listarea-height"><ul class="list-group finder-columnview-list-group">');
					

					if(jsonArrayObj == null || jsonArrayObj.lenght == 0) {
						//return "";
					} else {
						$.each(jsonArrayObj, function(index, obj) {
							sb.append(voptions.drawColumnRowView(parentid,obj));
						});

					}
					sb.append('</ul></div></div></td>');
					return sb.toString();
				},
				bindClickFun: function(triggerLI, fcvObj, voptions) {
					//构建点击触发函数
					fcvObj.find('li.active').removeClass("active");
					triggerLI.addClass("active");

					if(triggerLI.data('childrennum') == "0") {
						var allTds = triggerLI.parents('td:first').nextAll('td');
						if(allTds.length > 0) {
							allTds.remove();
						}
						//触发外部实现函数
						voptions.itemClickFun(triggerLI, fcvObj, voptions);
					} else {

						var allTds = triggerLI.parents('td:first').nextAll('td');
						//console.log('子列表数据不为空,删除上级节点 td 之后的数据,数量=' + allTds.length);
						if(allTds.length > 0) {
							allTds.remove();
						}

						//找到子节点
						if(voptions.async){
							//异步则自己绘制
							voptions.findChildItemFun(triggerLI, fcvObj, voptions);
						}else{
							voptions.drawChildColumnRowView(voptions.findChildItemFun(triggerLI, fcvObj, voptions),triggerLI, fcvObj, voptions);	
						}
						
					}

					

				},
				buildFinderColumnView: function(fcvObj, jsonArrayObj, voptions) {
					
					var strtype = '';
					if(voptions.rootType&&$.trim(voptions.rootType)!=''){
						strtype = voptions.rootType;
					}
					
					var strdomain = '';
					if(voptions.rootDomain&&$.trim(voptions.rootDomain)!=''){
						strdomain = voptions.rootDomain;
					}
					
					//构建根视图对象
					var firstColumnHtml = voptions.buildColumnView('-', jsonArrayObj, voptions,strtype,strdomain);

					fcvObj.find('table tr:first').append(firstColumnHtml);

					//设置提示内容
					//fcvObj.find('[data-toggle="tooltip"]').tooltip();
					//设置尺寸缩放
					fcvObj.find('.finder-columnview-resizablearea').resizable({ autoHide: true });

					//重新绑定激活函数
					fcvObj.find('.finder-columnview-list-group-item').unbind('click');
					fcvObj.find('.finder-columnview-list-group-item').click(function() {
						//console.log('root点击li id=' + $(this).data('fcvrowid'));
						voptions.bindClickFun($(this), fcvObj, voptions);
					})

					//重置尺寸
					voptions.refreshColumSize();
				},
				appendHeader:function(parentid, jsonArrayObj, voptions,coltype,coldomain){
					//return '<div class="finder-columnview-ui-widget-header">可改变尺寸区域1</div>';
					return "";
				},
				refreshColumSize: function() {
					//重置列选择项尺寸
				},
				rootType:'',
				rootDomain:'',
				initHeight: -1,
				initWidth: -1
			}, options); //这里用了$.extend方法，扩展一个对象

			var globalOptions = options;
			var that = $(this);

			that.reSettingHeight = function(height) {
				globalOptions.settingHeight(height);
			}

			that.reSettingWidth = function(height) {
				globalOptions.settingWidth(height);
			}

			that.findTdCol = function(parentId) {
				//根据上级编码得到列
				var tds = that.find('table tr:first').find('td');
				//console.log('tds.length=' + tds.length);
				if(tds == null || tds.length == 0) {
					return null;
				}
				//找到列对象
				if(!parentId || parentId == null || $.trim(parentId) == '' || $.trim(parentId) == '-') {
					return $(tds[0]);
				} else {
					for(ei = 0; ei < tds.length; ei++) {
						if($(tds[ei]).data('fcvcolid') == parentId) {
							return $(tds[ei]);
						}
					}
				}
				return null;
			}

			that.findCurrentSelfTdCol = function() {
				var lia = that.find('li.active');
				if(!lia || lia.length == 0) {
					//返回根节点
					return $(that.find('table tr:first').find('td')[0]);
				} else {
					//返回当前节点所在的列
					return $($(lia[0]).parents('td')[0]);
				}
			}
			//finder-columnview-list-group
			that.addRowToTdCol = function(parentId, rowObj) {
				var tdobj = that.findTdCol(parentId);
				if(tdobj != null) {
					tdobj.find('.finder-columnview-list-group').append(globalOptions.drawColumnRowView(parentId,rowObj));

					//设置提示内容
					//that.find('[data-toggle="tooltip"]').tooltip();
					//设置尺寸缩放
					that.find('.finder-columnview-resizablearea').resizable({ autoHide: true });

					//重新绑定激活函数
					that.find('.finder-columnview-list-group-item').unbind('click');
					that.find('.finder-columnview-list-group-item').click(function() {
						//console.log('addRowToTdCol 点击li id=:' + $(this).data('fcvrowid'));
						globalOptions.bindClickFun($(this), that, globalOptions);
					})
				}
			}

			//找到当前激活的节点
			that.findCurrentSelfLi = function() {
				var lia = that.find('li.active');
				if(!lia || lia.length == 0) {
					//返回根节点
					return null;
				} else {
					//返回当前节点所在的列
					return $($(lia[0]));
				}
			}

			//构建视图对象
			globalOptions.buildFinderColumnView(that, globalOptions.firstLevelJsonDatas, globalOptions);

			//初始化宽高
			if(globalOptions.initHeight > 0) {
				globalOptions.settingHeight(globalOptions.initHeight);
			}
			if(globalOptions.initWidth > 0) {
				globalOptions.settingWidth(globalOptions.initWidth);
			}

			return that; //return为了保持jQuery的链式操作
		}
	});
})(jQuery);