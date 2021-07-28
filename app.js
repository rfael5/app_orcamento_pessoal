class Despesa {
	constructor(ano,mes,dia,tipo,descricao,valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {
			
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			} 
		}
		return true
	}
}

class Bd {
	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id',0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		/*Aqui estamos armazenando os dados usando o recurso localStorage.
		Ele permite que acessemos a função "setItem". Nós passamos dois parâmetros
		para a função "setItem", o primeiro é o identificador do objeto que iremos
		armazenar, nesse caso "despesa", o segundo é o dado que iremos armazenar.

		Nesse caso, como estamos armazenando um objeto literal, primeiro precisamos 
		convertê-lo para uma notação JSON, e fazemos isso usando a sintaxe do segundo
		parâmetro abaixo.

		Nesse caso precisamos converter o objeto para uma notação JSON porque o objeto
		será acessado no browser, fora da nossa aplicação, e um objeto só funciona dentro
		da instancia da aplicação em que foi criado. Para acessar o objeto fora da aplicação,
		precisamos usar a biblioteca JSON para convertê-lo em string, para que só então
		possamos manipulá-lo no browser.*/
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id',id)
	}

	recuperarTodosRegistros() {

		//cria uma lista onde serão armazenadas todas as despesas
		let despesas = Array()

		/*seleciona os índices dos itens(nesse caso as despesas) adicionados na aplicação. Esta ação está
		armazenada dentro da variável id.*/
		let id = localStorage.getItem('id')

		/*Estrutura de repetição que irá percorrer o índice dos itens.*/
		for (let i = 1; i <= id; i++) {
			/*Selecionamos os ítens através do índice com "getItem".
			Convertemos os elementos de JSON para objetos literais novamente,
			para que possamos manipulá-lo na aplicação.*/
			let despesa = JSON.parse(localStorage.getItem(i))

			/*Caso alguma despesa seja excluída da lista, resultanto em um objeto
			"null", o "continue" fará com que a aplicação ignore o item null e vá
			direto para o próximo*/
			if (despesa === null) {
				continue
			}

			despesa.id = i
			//Adicionamos todas as despesas no array "despesas".
			despesas.push(despesa)
		}

		return despesas

	}

	pesquisar(despesa) {

		let despesasFiltradas = Array() 

		despesasFiltradas = this.recuperarTodosRegistros()

		console.log(despesasFiltradas)

		if(despesa.ano != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)}

		if(despesa.mes != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)}

		if(despesa.dia != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)}

		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)}

		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)}

		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}


let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
		)

	if (despesa.validarDados()) {
		document.getElementById("gravCerto").innerHTML = 'Voltar'
		document.getElementById("gravCerto").className = "btn btn-success"
		document.getElementById("tituloModal").className = "modal-header text-success"
		document.getElementById('texto').innerHTML = 'As despesas foram registradas.'
		document.getElementById('titulo').innerHTML = 'Registro inserido com sucesso.'
		//A função gravar é o que vai armazenar os dados que encaminharmos na página.
		bd.gravar(despesa)
		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

		
		}else {
			document.getElementById("gravCerto").innerHTML = 'Voltar e corrigir'
			document.getElementById("gravCerto").className = "btn btn-danger"
			document.getElementById("tituloModal").className = "modal-header text-danger"
			document.getElementById('texto').innerHTML = 'Por favor preencha todos os campos.'
			document.getElementById('titulo').innerHTML = 'Erro na gravação'		
			$('#modalRegistraDespesa').modal('show')
		}
}


function carregaListaDespesa(despesas = Array(), filtro = false) {


	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()}

	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	despesas.forEach(function(d){

		let linha = listaDespesas.insertRow()

		linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`

		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break

			case '2': d.tipo = 'Educação'
				break

			case '3': d.tipo = 'Lazer'
				break

			case '4': d.tipo = 'Saúde'
				break

			case '5': d.tipo = 'Transporte'
				break

		}


		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function() {
			//remover a despesa
			let id = this.id.replace('id_despesa_','')
			alert(id)
			bd.remover(id)

			window.location.reload()
		}
		linha.insertCell(4).append(btn)
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa (ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesa(despesas,true)
}

