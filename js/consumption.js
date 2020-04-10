/*jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true, devel: true */
// функция проверки на число
function isNumeric(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}
/*функция, отображающая результат на странице */
function changeResult(destination, value) {
	if (isNumeric(value)) {
			document.getElementById(destination).innerHTML = value;
	} else {
			document.getElementById(destination).innerHTML = "Введите корректное значение";
	}
}
/*функция, отображающая результат на странице для решеток*/
function changeResultGrille(destination, value) {
			document.getElementById(destination).innerHTML = value;
}
/*функция, проводящая непосредственно расчет расхода газа  */
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

	var resultConsumption = (pow * pow_dim * consump_dim / ((eff * 0.01) * hoc * hoc_dim)).toFixed(2);

	changeResult('resultGasConsumtion', resultConsumption);
}
function calculateBoilerRoom() {
// расчет ЛСК
	var volume_b = document.getElementById('volume_boil').value.replace(/,/, '.');
	var square_glass_gen = +(volume_b * 0.03).toFixed(2);
	var square_glass_boil = +(volume_b * 0.05).toFixed(2);
// расчет расхода воздуха и газа
	var hoc = document.getElementById('hoc_boil').value.replace(/,/, '.');
	var pow = document.getElementById('power_boil').value.replace(/,/, '.');
	var eff = document.getElementById('efficiency_boil').value.replace(/,/, '.');

	var n_hoc = document.getElementById("hoc_boil_dim").options.selectedIndex;
	var hoc_dim = parseFloat(document.getElementById("hoc_boil_dim").options[n_hoc].value);

	var n_pow = document.getElementById("power_boil_dim").options.selectedIndex;
	var pow_dim = document.getElementById("power_boil_dim").options[n_pow].value;

	var n_consump = document.getElementById("consumpion_boil_dim").options.selectedIndex;
	var consump_dim = document.getElementById("consumpion_boil_dim").options[n_consump].value;

	var gas_boil = +(pow * pow_dim * consump_dim / ((eff * 0.01) * hoc * hoc_dim)).toFixed(2);
// расчет расхода воздуха
	var alf = document.getElementById('alfa').value.replace(/,/, '.');
	var air_b_result = +(gas_boil * 9.54 * alf).toFixed(2);
	var incom_a_result = +(volume_b*3 + air_b_result).toFixed(2);
	var exhaust_a_result = parseFloat(volume_b*3).toFixed(2);
// расчет дефлектора
	var defl_count_opt = document.getElementById("count_deflectors").options.selectedIndex;
	var defl_count_val = parseFloat(document.getElementById("count_deflectors").options[defl_count_opt].value);

	var closestRight,
	closestRightVal,
    dataArr = {40: 100, 160: 200, 350: 300, 620: 400, 1000: 500, 1300: 600, 1900: 700, 2300: 800, 3000: 900, 3600: 1000, length: 10},
    number = exhaust_a_result / defl_count_val,
    current;

	for (var i = 0; i < dataArr.length; i++) {
	    current = +Object.keys(dataArr)[i];
	    if (current > number && (typeof closestRight === 'undefined' || closestRight > current)) {
	        closestRight = current;
			closestRightVal = Object.values(dataArr)[i];
	    }
	}
// расчет жалюзийной решетки
	var grille_num_opt = document.getElementById('count_grille').options.selectedIndex;
	var grille_num = document.getElementById('count_grille').options[grille_num_opt].value;

	var air_vel = document.getElementById('air_velocity').value.replace(/,/, '.');
	var grilleSquare = (exhaust_a_result / (air_vel * 3600 * grille_num)).toFixed(4);

	var closestRightGrille,
	closestRightValGrille,
    grilles = {'100x100': 0.01, '200x100': 0.02, '300x100': 0.03, '400x100': 0.04, '500x100': 0.05, '600x100': 0.06, '200x200': 0.04, '300x200': 0.06, '400x200': 0.08, '500x200': 0.1, '600x200': 0.12, '700x200': 0.14, '800x200': 0.16, '1000x200': 0.2, '300x300': 0.09, '400x300': 0.12, '500x300': 0.15, '600x300': 0.18, '700x300': 0.21, '800x300': 0.24, '1000x300': 0.3, length: 21},
    numberGrille = grilleSquare,
    currentGrille;

	for (var j = 0; j < grilles.length; j++) {
	    currentGrille = Object.values(grilles)[j];
	    if (currentGrille > numberGrille && (typeof closestRightGrille === 'undefined' || closestRightGrille > currentGrille)) {
	        closestRightGrille = currentGrille;
			closestRightValGrille = Object.keys(grilles)[j];
	    }
	}
	changeResult('gen_glass_result', square_glass_gen);
	changeResult('boil_glass_result', square_glass_boil);
	changeResult('gas_boil_result', gas_boil);
	changeResult('air_burn_result', air_b_result);
	changeResult('incom_air_result', incom_a_result);
	changeResult('exhaust_air_result', exhaust_a_result);
	changeResult('real_deflect_result', closestRightVal);
	changeResult('square_grille_calc', grilleSquare);
	changeResultGrille('real_square_grille', closestRightValGrille);
}
// расчет годового потребления тепла и топлива
function calculateHeatAndFuel() {
	'use strict';
	// часовой расход на отопление
	let hh = document.getElementById('hh').value.replace(/,/, '.');
	// размерность часового расхода на отопление
	let n_hh = document.getElementById("dim_hh_hf").options.selectedIndex;
	let hh_dim = parseFloat(document.getElementById("dim_hh_hf").options[n_hh].value);
	// внутренняя тепмература для расчета отопления
	let t_heat_ins = document.getElementById('t_heat_ins').value.replace(/,/, '.');
	// наружная температура для расчета отопления
	let t_heat_ex = document.getElementById('t_heat_ex').value.replace(/,/, '.');
	// продолжительность отопительного периода
	let heat_period = document.getElementById('heat_period').value.replace(/,/, '.');
	// средняя за период наружная температура
	let t_mid = document.getElementById('t_mid').value.replace(/,/, '.');
	// годовой расход на отопление


	let n_heat_sum_dim = document.getElementById("heat_sum_dim").options.selectedIndex;
	let heat_sum_dim = parseFloat(document.getElementById("heat_sum_dim").options[n_heat_sum_dim].value);

	let heat_sum = ((hh * hh_dim) * (t_heat_ins - t_mid) / (t_heat_ins - t_heat_ex) * 24 * heat_period * heat_sum_dim).toFixed(2);






	changeResult('heat_sum', heat_sum);
}
