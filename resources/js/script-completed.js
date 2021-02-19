function addProductToTable (product) {
    let row = document.createElement('tr');
    let td = document.createElement('td');
    td.innerText = product.name;
    row.appendChild(td);

    td = document.createElement('td');
    td.innerText = 'R$'+product.price+',00';
    row.appendChild(td);

    $('.completed-order-table tbody').append(row);
}

let recoveredData = JSON.parse(sessionStorage.getItem('sent_data'));
if (!recoveredData) {
    $('.no-order').css('display', 'block');
    console.error('Erro, não foi possível adquirir detalhes da compra!');
    alert('Ocorreu um erro.');
}
else {
$('.no-order').css('display', 'none');
$('.order-finished-container').css('display', 'block');

$('#user-name').text('Nome: '+recoveredData.user.name);
$('#user-city').text('Cidade: '+recoveredData.user.city);
$('#user-district').text('Bairro: '+recoveredData.user.district);
$('#user-road').text('Rua: '+recoveredData.user.road);
$('#user-number').text('Número: '+recoveredData.user.number);
$('#delivery-estimate').text('Dias úteis até a entrega: '+recoveredData.deadLine);

let priceSum = 0;
for (let i = 0; i < recoveredData.orderedProducts.length; i++) {
    addProductToTable (recoveredData.orderedProducts[i].product);
    priceSum += parseInt(recoveredData.orderedProducts[i].product.price);
}

let finalRow = document.createElement ('tr');
let td = document.createElement ('td');
td.innerText = 'Preço total do pedido';
finalRow.append(td);

td = document.createElement ('td');
td.innerText = 'R$'+priceSum+',00';
finalRow.append(td);

$('.completed-order-table').append(finalRow);
}