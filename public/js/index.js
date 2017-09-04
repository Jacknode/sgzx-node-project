$(function() {
	var user = $('#user');
	var login = $('#login');
	var admin = $('#admin');

	user.find('.btn1').on('click', function() {
		user.hide();
		login.show()
	})
	login.find('.btn1').on('click', function() {
			login.hide();
			user.show();
		})
		//注册
	login.find('.btn2').on('click', function() {
			var username = login.find('[name=username]').val();
			var password = login.find('[name=password]').val();
			var repassword = login.find('[name=respassword]').val();

			$.ajax({
				type: 'post',
				url: '/api/user/login',
				data: {
					username: username,
					password: password,
					respassword: repassword
				},
				dataType: 'json',
				success: function(data) {
					login.find('p').html(data.message);
					if (!data.code) {
						setTimeout(function() {
							$user.show();
							$login.hide();
						}, 1000)
					}
				}
			})

		})
		//登陆
	user.find('button').on('click', function() {
		//alert(1)
		var username = user.find('[name=username]').val();
		var password = user.find('[name=password]').val();
		//console.log(username+password)
		$.ajax({
			type: 'post',
			url: '/api/user/submit',
			data: {
				username: username,
				password: password
			},
			dataType: 'json',
			success: function(rs) {
				user.find('p').html(rs.message);
				console.log(rs)
				if (!rs.code) {
					setTimeout(function() {
						window.location.reload();
					}, 1000)
				}

			}
		})
	})

	$('#laydown').on('click', function() {
		$.ajax({
			type: "get",
			url: "/api/user/laydown",
			success: function(rs) {
				if (!rs.code) {
					window.location.reload();
				}
			}
		});
	})

})