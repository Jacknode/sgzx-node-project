$(function() {
	//判断是不是管理员
	// console.log(document.getElementById('isAdmin').innerHTML)
	console.log($('#isAdmin'))

	function del(val, fn) {
		$('#login').html(val).animate({
			top: 0
		})
		setTimeout(function() {
			$('#login').html(val).animate({
				top: -40
			})
			fn && fn()
		}, 600)

	}

	// //	内容删除功能ajax
	// 	//console.log('{{objname._id.toString()}}')
	// 	$('#del').on('click',function(){
	// 		//alert(1)
	// 		var id = $(this).attr("val");
	// 		//console.log(id)
	// 		$.ajax({
	// 			type:"post",
	// 			url:"/admin/content/delete",
	// 			dataType:'json',
	// 			data:{id:id},
	// 			success:function(data){
	// 				//console.log(data)
	// 				if(data.code ==1){
	// 					del(data.message);
	// 					setTimeout(function(){
	// 						window.location.reload()
	// 					},2000)
	//
	// 				}
	// 			}
	// 		});
	// 	});
	function submit(url, id) {
		var contentID = $('#giser').val();
		var title = $('[name=title]').val();
		var derection = $('[name=derection]').val();
		var content = $('[name=content]').val();
		//console.log(derection)
		//console.log(contentID)
		$.ajax({
			type: "post",
			url: url,
			data: {
				contentID: contentID,
				title: title,
				derection: derection,
				content: content,
				id: id
			},
			dataType: 'json',
			success: function(data) {
				//console.log(data);
				if (data.code == 2) {
					del(data.message);
					setTimeout(function() {
						window.location.href = '/admin/content';
					}, 1000)
				}
			}
		});
	}

	//导航添加ajax

	$('#gisersubmit').on('click', function() {
			var name = $('[name=name]').val();
			$.ajax({
				type: 'post',
				url: '/admin/giser/add',
				data: {
					name: name
				},
				dataType: 'json',
				success: function(data) {
					switch (data.code) {
						case 1:
							del(data.message);
							break;
						case 2:
							del(data.message)
							break;
						case 3:
							break;
					}
				}
			})
		})
		// 导航修改ajax
	$('.updateSubmit').on('click', function() {
			var id = $(this).attr('val');
			var name = $('[name=name]').val();
			//alert(1)
			$.ajax({
				type: 'post',
				url: '/admin/giser/update',
				data: {
					id: id,
					name: name
				},
				dataType: 'json',
				success: function(data) {
					if (data.code == 1) {
						del(data.message)
					} else if (data.code == 2) {
						del(data.message, function() {
							setTimeout(function() {
								window.location.href = '/admin/giser';
							}, 1000)
						})
					}
				}
			})
		})
		// 导航删除ajax
	$('.giserdel').on('click', function() {
		var id = $(this).attr('val');
		//console.log(id)
		$.ajax({
			type: 'post',
			url: '/admin/giser/delete',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				if (data.code == 1) {
					del(data.message, function() {
						setTimeout(function() {
							window.location.href = '/admin/giser';
						}, 1000)
					})
				}
			}
		})
	});

	//	内容添加功能ajax
	$('#contentsubmit').on('click', function() {
		var id = $(this).attr('val');
		submit("/admin/content/add", id);
	});


	// 内容修改
	$('#contentUpdate').on('click', function() {
		var id = $(this).attr('val');
		//console.log(id)
		submit("/admin/content/update", id);
	});

	// 内容删除
	$('.contentdel').on('click', function() {
		var id = $(this).attr('val');

		$.ajax({
			type: 'post',
			url: '/admin/content/delete',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				del(data.message, function() {
					window.location.reload();
				})
			}
		})
	});

	// // 轮播图片添加ajax

	// $('#imgsubmit').on('click', function() {
	// 	var name = $('[name=name]').val();
	// 	var url = $('[name=url]').val();
	// 	var imgurl = $('[name=imgurl]').val();
	// 	console.log(imgurl);

	// 	$.ajax({
	// 		type: 'post',
	// 		url: '/admin/img/add',
	// 		data: {
	// 			name: name,
	// 			url: url,
	// 			imgurl: imgurl
	// 		},
	// 		dataType: 'json',
	// 		success: function(data) {
	// del(data.message);
	// setTimeout(function() {
	// 	window.location.href = '/admin/img';
	// }, 1000)
	// 		}
	// 	})
	// });
	// $('#imgSubmit').on('keyup', function() {
	// 	alert(1)
	// 	del('添加成功');
	// 	setTimeout(function() {
	// 		window.location.href = '/admin/img';
	// 	}, 1000)
	// })


	// 轮播图片修改ajax

	$('#imgupdate').on('click', function() {
		var name = $('[name=name]').val();
		var url = $('[name=url]').val();
		var imgurl = $('[name=imgurl]').val();
		var id = $(this).attr('val')

		$.ajax({
			type: 'post',
			url: '/admin/img/update',
			data: {
				name: name,
				url: url,
				imgurl: imgurl,
				id: id
			},
			dataType: 'json',
			success: function(data) {
				del(data.message)
				setTimeout(function() {
					window.location.href = '/admin/img';
				}, 1000)
			}
		})
	});

	// 图片删除

	$('.imgdel').on('click', function() {
		var id = $(this).attr('val');
		$.ajax({
			type: 'post',
			url: '/admin/img/delete',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				del(data.message, function() {
					window.location.reload();
				})
			}
		})
	})


	//详情添加ajax
	$('#detailsubmit').on('click', function() {
			var title = $('[name=contentID]').val();
			var derection = $('[name=derection]').val();
			var content = $('[name=content]').val();
			console.log(title)
			$.ajax({
				type: 'post',
				url: '/admin/details/detail/add',
				data: {
					title: title,
					derection: derection,
					content: content
				},
				dataType: 'json',
				success: function(data) {
					del(data.message, function() {
						window.location.reload();
					})
				}
			})
		})
		//详情删除
	$('.detaildel').on('click', function() {
		var id = $(this).attr('val');
		// console.log(id)
		$.ajax({
			type: 'post',
			url: '/admin/details/delete',
			data: {
				id: id
			},
			dataType: 'json',
			success: function(data) {
				del(data.message, function() {
					window.location.reload();
				})
			}
		})
	})


});