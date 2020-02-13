
// функция проверки на число
function isNumeric(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}
/*функция, проводящая непосредственно вычисления */
function calculateGasConsumption(){

	var hoc = document.getElementById('hoc').value.replace(/,/, '.');
	var pow = document.getElementById('power').value.replace(/,/, '.');
	var eff = document.getElementById('efficiency').value.replace(/,/, '.');

	var n_hoc = document.getElementById("hoc_dim").options.selectedIndex;
	var hoc_dim = parseFloat(document.getElementById("hoc_dim").options[n_hoc].value);

	var n_pow = document.getElementById("power_dim").options.selectedIndex;
	var pow_dim = document.getElementById("power_dim").options[n_pow].value;

	var n_consump = document.getElementById("consumpion_dim").options.selectedIndex;
	var consump_dim = document.getElementById("consumpion_dim").options[n_consump].value;

	var result = (pow * pow_dim * consump_dim / ((eff * 0.01) * hoc * hoc_dim)).toFixed(2);

	if (isNumeric(result)) {
		changeResult(result);
	} else {
		document.getElementById('result').innerHTML = "Введите корректные данные, Вы же инженер!!!";
	}
	/*функция, отображающая результат на странице */
	function changeResult(result){
	document.getElementById('result').innerHTML = result;
	}
}
