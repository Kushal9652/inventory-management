var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    itemName = document.getElementById("name"),
    quantity = document.getElementById("quantity"),
    price = document.getElementById("price"),
    category = document.getElementById("category"),
    submitBtn = document.querySelector(".submit"),
    itemInfo = document.getElementById("data"),
    modalTitle = document.querySelector("#itemForm .modal-title"),
    newItemBtn = document.querySelector(".newItem"),
    successAlert = document.getElementById("successAlert");

let getData = localStorage.getItem('inventoryItems') ? JSON.parse(localStorage.getItem('inventoryItems')) : [];

let isEdit = false, editId;

showInfo();

newItemBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Add New Item";
    isEdit = false;
    imgInput.src = "./image/default-item.webp";
    form.reset();
});

file.onchange = function() {
    if (file.files[0].size < 1000000) {  // 1MB = 1000000 bytes
        var fileReader = new FileReader();

        fileReader.onload = function(e) {
            imgInput.src = e.target.result;
        };

        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("This file is too large!");
    }
};

function showInfo() {
    itemInfo.innerHTML = ''; 
    getData.forEach((element, index) => {
        let createElement = `<tr class="itemDetails">
            <td>${index + 1}</td>
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>
            <td>${element.itemName}</td>
            <td>${element.quantity}</td>
            <td>${element.price}</td>
            <td>${element.category}</td>
            <td>
                <button class="btn btn-info" onclick="readInfo('${element.picture}', '${element.itemName}', '${element.quantity}', '${element.price}', '${element.category}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${index}, '${element.picture}', '${element.itemName}', '${element.quantity}', '${element.price}', '${element.category}')" data-bs-toggle="modal" data-bs-target="#itemForm"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;

        itemInfo.innerHTML += createElement;
    });
}

function readInfo(pic, name, quantity, price, category) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = name;
    document.querySelector("#showQuantity").value = quantity;
    document.querySelector("#showPrice").value = price;
    document.querySelector("#showCategory").value = category;
}

function editInfo(index, pic, name, quantity, price, category) {
    isEdit = true;
    editId = index;

    imgInput.src = pic;

    // Set the form fields with previous values
    itemName.value = name;
    document.getElementById('quantity').value = quantity; // Correctly setting the quantity field
    document.getElementById('price').value = price; // Correctly setting the price field
    category.value = category;

    // Update button text and modal title
    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update Item";
}

function deleteInfo(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        getData.splice(index, 1);
        localStorage.setItem("inventoryItems", JSON.stringify(getData));
        showInfo();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        picture: imgInput.src === "./image/default-item.webp" ? imgInput.src : imgInput.src,
        itemName: itemName.value,
        quantity: quantity.value,
        price: price.value,
        category: category.value
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    localStorage.setItem('inventoryItems', JSON.stringify(getData));
    showInfo();


    successAlert.classList.remove('d-none');
    setTimeout(() => {
        successAlert.classList.add('d-none');
    }, 3000); // Hide after 3 seconds

    form.reset();
    imgInput.src = "./image/default-item.webp";  


    var itemFormModal = bootstrap.Modal.getInstance(document.getElementById('itemForm'));
    itemFormModal.hide();
});