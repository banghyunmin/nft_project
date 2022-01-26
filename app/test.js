exports.html = `
<html>
	<head></head>
	<body>
		<form action="/users" method="post">
			<input type="text" id="name" name="name"/>
			<input type="password" id="pw" name="pw"/>
			<button type="submit">Login</button>
		</form>
	</body>
</html>
`
exports.login = `
<html>
	<head></head>
	<body>
		<form action="/users/bang" method="post">
			<input type="text" id="name" name="name"/>
			<input type="password" id="pw" name="pw"/>
			<button type="submit">Login</button>
		</form>
	</body>
</html>
`
exports.logout = `
<html>
	<head></head>
	<body>
		<form action="/users/bang" method="delete">
			<input type="text" id="name" name="name"/>
			<input type="password" id="pw" name="pw"/>
			<button type="submit">Login</button>
		</form>
	</body>
</html>
`
