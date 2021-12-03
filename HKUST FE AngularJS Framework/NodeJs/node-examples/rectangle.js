module.exports = (x, y, callback) => {
	console.log('Solving for rectangle with l =', x, 'and b =', y);

	if (x <= 0 || y <= 0) {
		setTimeout(() => callback(
			new Error('Rectangle dimensions should be greater than zero: l = ' + x + ', and b = ' + y),
			null,
		), 2000);
		return;
	}

	setTimeout(() => callback(
		null,
		{
			perimeter: 2 * (x + y),
			area: x * y,
		},
	), 2000);
}
