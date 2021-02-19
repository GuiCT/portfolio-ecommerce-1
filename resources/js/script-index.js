//productList inicializado
const orders = [];
/* Esse array agrupa todos os produtos dentro do pedido do usuário, associando esse produto
à uma linha na tabela final que mostra o pedido completo. Dessa forma, podemos remover ao mesmo tempo a linha da tabela
enquanto removemos o produto do pedido todal, sem ter que fazer isso utilizando de dois arrays.
Depois é associada à sendData. */

let usernameDetails =
{ //Variável que recebe os valores do usuário e armazena. Depois é associada à sendData
    name: {},
    city: {},
    district: {},
    road: {},
    number: {}
};

let sendData = {}; //Variável posteriormente utilizada para enviar produtos para a página de confirmação

const selectedCategories = [true, true, true]; //Armazena o status de visualização das categorias

function selectContent (id)
{ 
    let contentList = $('.content');

    for (let i = 0; i < contentList.length; i++) {
        if (contentList[i].classList.contains('hidden'))
            continue;

        contentList[i].classList.add('hidden');
    }

    $(id).removeClass('hidden');
}

function addProductToTable (categoryIndex, productIndex)
{ 
    let product = productList.categories[categoryIndex].products[productIndex];
    let row = document.createElement ('tr');

    //Selecionando categoria do produto
    switch (categoryIndex) {
        case 0:
            row.classList.add ('category-smartphones');
            break;
        case 1:
            row.classList.add ('category-books');
            break;
        case 2:
            row.classList.add ('category-movies');
            break;
    }

    //Primeiro <td>: Foto da categoria
    let td = document.createElement ('td');
    td.classList.add ('item-image');
    let content = document.createElement ('img');
    content.classList.add ('table-image');

    //Selecionando a foto
    switch (categoryIndex) {
        case 0:
            content.src = './resources/images/smartphone.png';
            content.alt = 'Ícone de Smartphone';
            break;
        case 1:
            content.src = './resources/images/book-icon.png';
            content.alt = 'Ícone de Livro';
            break;
        case 2:
            content.src = './resources/images/Movie-Studio-icon.png';
            content.alt = 'Ícone de Filme';
            break;
    }
    
    td.appendChild (content);
    row.appendChild (td);
    //============================================

    //Segundo <td>: Nome do produto
    td = document.createElement ('td');
    td.innerText = product.name;
    td.classList.add ('item-name');
    row.appendChild (td);
    //============================================

    //Terceiro <td>: Categoria do produto
    td = document.createElement ('td');
    td.classList.add ('item-category');

    //Selecionando a categoria
    switch (categoryIndex) {
        case 0:
            td.innerText = 'Smartphone';
            break;
        case 1:
            td.innerText = 'Livro';
            break;
        case 2:
            td.innerText = 'Filme';
            break;
    }

    row.appendChild (td);
    //============================================

    //Quarto <td>: Preço do produto
    td = document.createElement ('td');
    td.classList.add ('item-price');
    td.innerText = 'R$'+product.price+',00';
    row.appendChild (td);
    //============================================

    //Quinto <td>: Botão de adicionar ao carrinho
    td = document.createElement ('td');
    td.classList.add ('item-addtoorder');
    content = document.createElement ('a');
    content.textContent = 'Adicionar ao carrinho';
    content.classList.add ('clickable');

    //Gerando um eventListener diferente para cada <td>
    content.addEventListener ('click',
    function () {
        addProductToOrder (product);
    });

    td.appendChild (content);
    row.appendChild (td);
    //============================================

    //Associando a <tr> inteira na tabela.
    $('#product-table tbody').append(row);
}

function addProductToOrder (product)
{ 
    let row = document.createElement('tr');
    orders.push ({product: product, row: row});
    //Criando a <tr>, associando-a ao produto adicionado e armazenando ambos na variável orders.
    
    //Primeiro <td>: nome
    let td = document.createElement('td');
    td.innerText = product.name;
    row.appendChild(td);
    //============================================

    //Segundo <td>: preço
    td = document.createElement('td');
    td.classList.add ('order-list-price');
    td.innerText = 'R$'+product.price+',00';
    row.appendChild(td);
    //============================================

    //Terceiro <td>: botão de remover do carrinho
    td = document.createElement('td');
    let content = document.createElement('a');
    content.classList.add ('clickable');
    
    //Adicionando EventListener para o botão de remover do carrinho
    content.addEventListener ('click',
    function () {
        removeProductFromOrder (row.rowIndex);
    });
    
    content.textContent = 'Remover do carrinho';
    td.appendChild(content);
    row.appendChild(td);
    //============================================

    //Usando DOM para aproveitar da função insertBefore, indisponível em jQuery
    $('#order-table tbody')[0].insertBefore(row, $('#final-row-order-list')[0]);

    //Calculando soma do preço total da compra
    let priceSum = 0;
    for (let i = 0; i < orders.length; i++)
        priceSum += parseInt(orders[i].product.price);
    
    //Inserindo o preço total na última linha da tabela
    $('#total-price').text('R$'+priceSum+',00');
    //============================================
}

function removeProductFromOrder (index)
{ 
    if (orders.length == 0) //Não há como remover caso não haja produtos selecionados.
        return false;
    
    orders[index].row.remove(); //Removendo a linha index da tabela.
    orders.splice(index,1); //Removendo o produto da variável orders

    //Calculando preço total da soma
    let sum = 0; 
    for (let i = 0; i < orders.length; i++)
        sum += parseInt(orders[i].product.price);
    //============================================

    //Inserindo valor da soma na última linha
    $('#total-price').text('R$'+sum+',00');
}

function removeAllFromOrder ()
{ 
    let trList = $('#order-table tr');
    trList.splice(-1,1);

    if (trList.length == 0) {
        alert('Não há nada para remover do carrinho!');
        return false;
    }
    //Verifica se a única linha detectada é a última, caso seja, não permite que a mesma seja deletada.
    //Caso prossiga, a última linha já foi excluida da trList, o que impossibilita a mesma de ser deletada

    //Varre todas as linhas presentes em trList
    for (let i = 0; i < orders.length; i++) {
        trList[i].remove(); //Remove a linha da tabela
    }

    orders.splice(0,); //Dando clear no array orders
    $('#total-price').text('R$0,00'); //Setando valor total como nulo
}

function filterCategory (category, show)
{ 
    let rowList = $(category);
    //Recebe todas as linhas da categoria selecionada

    let styleValue = {};

    for (let i = 0; i < rowList.length; i++) {
        switch (show) {
            case 0:
                rowList[i].classList.add('hidden');
                break;
            case 1:
                rowList[i].classList.remove('hidden');
                break;
        }
    }
}

$('#checkbox-smartphones')[0].addEventListener ('change',
function()
{
    if (this.checked) {
        filterCategory ('.category-smartphones', 1);
        selectedCategories[0] = true;
    }
    else {
        filterCategory ('.category-smartphones', 0);
        selectedCategories[0] = false;
    }
    
    if (!(selectedCategories[0]) && !(selectedCategories[1]) && !(selectedCategories[2])) {
        $('#product-table table').css('display', 'none');
        $('#warning-no-categories').css('display', 'block');
    }
    else {
        $('#warning-no-categories').css('display', 'none');
        $('#product-table table').css('display', 'block');
    }
});

$('#checkbox-books')[0].addEventListener ('change',
function()
{
    if (this.checked) {
        filterCategory ('.category-books', 1);
        selectedCategories[1] = true;
    }
    else {
        filterCategory ('.category-books', 0);
        selectedCategories[1] = false;
    }

    if (!(selectedCategories[0]) && !(selectedCategories[1]) && !(selectedCategories[2])) {
        $('#product-table table').css('display', 'none');
        $('#warning-no-categories').css('display', 'block');
    }
    else {
        $('#warning-no-categories').css('display', 'none');
        $('#product-table table').css('display', 'block');
    }
});

$('#checkbox-movies')[0].addEventListener ('change',
function()
{
    if (this.checked) {
        filterCategory ('.category-movies', 1);
        selectedCategories[2] = true;
    }
    else {
        filterCategory ('.category-movies', 0);
        selectedCategories[2] = false;
    }

    if (!(selectedCategories[0]) && !(selectedCategories[1]) && !(selectedCategories[2])) {
        $('#product-table table').css('display', 'none');
        $('#warning-no-categories').css('display', 'block');
    }
    else {
        $('#warning-no-categories').css('display', 'none');
        $('#product-table table').css('display', 'block');
    }
});

$('#confirm-order')[0].addEventListener ('click',
function ()
{
    if (orders.length == 0) {
        alert('Não há como confirmar o pedido: nenhum produto no carrinho!');
        return false;
    }

    usernameDetails.name = $('#username')[0].value;
    if (usernameDetails.name.length == 0) {
        alert('Não há como confirmar o pedido: nenhum nome inserido!');
        return false;
    }
    
    usernameDetails.city = $('#city')[0].value;
    if (usernameDetails.city.length == 0) {
        alert('Não há como confirmar o pedido: nenhuma cidade inserida!');
        return false;
    }

    usernameDetails.district = $('#district')[0].value;
    if (usernameDetails.district.length == 0) {
        alert('Não há como confirmar o pedido: nenhum bairro inserido!');
        return false;
    }

    usernameDetails.road = $('#road')[0].value;
    if (usernameDetails.road.length == 0) {
        alert('Não há como confirmar o pedido: nenhuma rua inserida!');
        return false;
    }

    usernameDetails.number = $('#number')[0].value;
    if (usernameDetails.number.length == 0) {
        alert('Não há como confirmar o pedido: nenhum número inserido!');
        return false;
    }
    
    sendData.orderedProducts = orders;
    sendData.user = usernameDetails;
    sendData.deadLine = 3+Math.floor(Math.random()*6); //Um prazo de entrega entre 3-8 dias.
    sendData = JSON.stringify(sendData);
    sessionStorage.setItem('sent_data', sendData);

    window.location.href = './completed.html';
})

for (let i = 0; i < productList.categories.length; i++)
    for (let j = 0; j < productList.categories[i].products.length; j++)
        addProductToTable (i,j);

let tableNames = $('.item-name');

/*Código que permite a filtragem por nome através do input #textfilter-name
Esse código não foi escrito por mim, mas pode ser encontrado no site do W3S:
https://www.w3schools.com/jquery/jquery_filters.asp
A mudança que eu realizei foi que a filtragem leva em conta apenas o <td> que contém
o nome dos produtos (.item-name), e não qualquer <td> da <tr>.*/

$(document).ready(function()
{
    $("#textfilter-name").on("keyup", function()
    {
        let value = $(this).val().toLowerCase();
        $("#product-table .item-name").filter(function()
        {
            $(this.parentNode).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});