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
	let hh = +document.getElementById('hh').value.replace(/,/, '.');
	// внутренняя тепмература для расчета отопления
	let t_heat_ins = document.getElementById('t_heat_ins').value.replace(/,/, '.');
	// наружная температура
	let t_heat_ex = document.getElementById('t_heat_ex').value.replace(/,/, '.');
	// продолжительность отопительного периода
	let heat_period = document.getElementById('heat_period').value.replace(/,/, '.');
	// средняя за период наружная температура
	let t_mid = document.getElementById('t_mid').value.replace(/,/, '.');
// годовой расход на отопление
	let heat_sum = +(hh * (t_heat_ins - t_mid) / (t_heat_ins - t_heat_ex) * 24 * heat_period).toFixed(2);
  // часовой расход на вентиляцию
	let hv = +document.getElementById('hv').value.replace(/,/, '.');
	// внутренняя тепмература для расчета вентиляции
	let t_vent_ins = document.getElementById('t_vent_ins').value.replace(/,/, '.');
	// годовой расход на вентиляцию
	let vent_sum = +(hv * (t_vent_ins - t_mid) / (t_vent_ins - t_heat_ex) * 24 * heat_period).toFixed(2);
  // часовой расход на ГВС
	let hw = +document.getElementById('hw').value.replace(/,/, '.');
	// средний расход тепла на ГВС в летний период
	let q_hm_s = hw * 0.8;
	// Усредненное число часов работы системы ГВС в сутки
	let hw_n = document.getElementById('hw_n').value.replace(/,/, '.');
// годовой расход тепла на ГВС
	let hw_sum = +( ((hw * heat_period * hw_n) + q_hm_s *(350 -heat_period) * hw_n)).toFixed(2);
  // часовой расход тепла на технологию
	let ht = +document.getElementById('ht').value.replace(/,/, '.');
	 // количество часов работы технологии
	let hour_tech = document.getElementById('hour_tech').value.replace(/,/, '.');
	// количество дней работы технологии
	let day_tech = document.getElementById('day_tech').value.replace(/,/, '.');
// годовой расход тепла на технологию
	let tech_sum = +(ht * hour_tech * day_tech).toFixed(2);
// годовой расход тепла на потери в теплосетях
	let total = +(tech_sum + hw_sum + vent_sum + heat_sum);
	let lost_sum = ( (tech_sum + hw_sum + vent_sum + heat_sum) * 0.03  ).toFixed(2);
// годовой расход газа
	let hoc_hf = +document.getElementById('hoc_hf').value.replace(/,/, '.');
	let efficiency_hf = +document.getElementById('efficiency_hf').value.replace(/,/, '.') * 0.01;
	let gas_sum_hf = +( total / (hoc_hf * efficiency_hf) ).toFixed(4);
// годовой расход условного топлива
  let hoc_tut = 7000;
	let tut_sum_hf = +( total / (hoc_tut *efficiency_hf) ).toFixed(4);
	// максимальный часовой расход газа
	let total_h = hh + hv + hw + ht;
	let hour_max_gas = ( total_h * 1000000 / (hoc_hf * efficiency_hf) ).toFixed(2);
	// удельный расход
	let spec_cons = (tut_sum_hf * 1000000 / total).toFixed(2);

	changeResult('heat_sum', heat_sum);
	changeResult('vent_sum', vent_sum);
	changeResult('hw_sum', hw_sum);
	changeResult('tech_sum', tech_sum);
	changeResult('lost_sum', lost_sum);
	changeResult('gas_sum_hf', gas_sum_hf);
	changeResult('tut_sum_hf', tut_sum_hf);
	changeResult('hour_max_gas', hour_max_gas);
	changeResult('spec_cons', spec_cons);
}
