document.addEventListener('DOMContentLoaded', () => {
    const salesForm = document.getElementById('salesForm');
    const salesData = document.getElementById('salesData');
    const totalAmountElem = document.getElementById('totalAmount');
    const saleProductSelect = document.getElementById('saleProduct');
    const salePriceInput = document.getElementById('salePrice');
    const editSaleProductSelect = document.getElementById('editSaleProduct');
    const editSalePriceInput = document.getElementById('editSalePrice');
    let salesRecords = JSON.parse(localStorage.getItem('salesRecords')) || [];

    // Load items from localStorage for the dropdowns
    function loadItems() {
        const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

        // Clear existing options
        saleProductSelect.innerHTML = '<option value="" disabled selected>Choose an item</option>';
        editSaleProductSelect.innerHTML = '<option value="" disabled selected>Choose an item</option>';
        
        // Populate both dropdowns
        inventoryItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.itemName;
            option.textContent = item.itemName;

            // Append to both dropdowns
            saleProductSelect.appendChild(option.cloneNode(true)); // Clone and append to main form
            editSaleProductSelect.appendChild(option); // Append to edit modal
        });

        // Reset values to default
        saleProductSelect.value = '';
        salePriceInput.value = '';
        editSaleProductSelect.value = '';
        editSalePriceInput.value = '';
    }

    // Update price when item is selected in the main form
    saleProductSelect.addEventListener('change', function() {
        const selectedItem = this.value;
        const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const item = inventoryItems.find(i => i.itemName === selectedItem);
        if (item) {
            salePriceInput.value = item.price;
        } else {
            salePriceInput.value = '';
        }
    });

    // Update price when item is selected in the edit modal
    editSaleProductSelect.addEventListener('change', function() {
        const selectedItem = this.value;
        const inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];
        const item = inventoryItems.find(i => i.itemName === selectedItem);
        if (item) {
            editSalePriceInput.value = item.price;
        } else {
            editSalePriceInput.value = '';
        }
    });

    // Calculate and display the total amount in INR
    function calculateTotal() {
        const total = salesRecords.reduce((sum, record) => sum + (record.price * record.quantity), 0);
        totalAmountElem.textContent = `₹${total.toFixed(2)}`;
    }

    // Display sales records
    function displaySales() {
        salesData.innerHTML = '';
        salesRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.date}</td>
                <td>${record.itemName}</td>
                <td>${record.quantity}</td>
                <td>₹${record.price.toFixed(2)}</td>
                <td>${record.customerName}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editSale(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSale(${index})">Delete</button>
                </td>
            `;
            salesData.appendChild(row);
        });
        calculateTotal();
    }

    // Handle sale form submission
    salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSale = {
            date: document.getElementById('saleDate').value,
            itemName: saleProductSelect.value,
            quantity: parseInt(document.getElementById('saleQuantity').value),
            price: parseFloat(salePriceInput.value),
            customerName: document.getElementById('saleCustomer').value
        };

        salesRecords.push(newSale);
        localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
        displaySales();

        // Reset the form
        salesForm.reset();
        saleProductSelect.value = ''; // Set default option
        salePriceInput.value = ''; // Clear price input
    });

    // Edit sale function
    window.editSale = (index) => {
        const sale = salesRecords[index];
        console.log('Editing Sale:', sale); // Check the sale object
        
        document.getElementById('editSaleDate').value = sale.date;
        document.getElementById('editSaleProduct').value = sale.itemName;
        document.getElementById('editSaleQuantity').value = sale.quantity;
        document.getElementById('editSalePrice').value = sale.price;
        document.getElementById('editSaleCustomer').value = sale.customerName;
        document.getElementById('editSaleIndex').value = index;

        // Update price in edit modal
        editSaleProductSelect.value = sale.itemName;
        editSaleProductSelect.dispatchEvent(new Event('change')); // Trigger change event to update price

        const editSalesModal = new bootstrap.Modal(document.getElementById('editSalesModal'));
        editSalesModal.show();
    };

    // Update sale function
    document.getElementById('editSalesForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editSaleIndex').value;
        salesRecords[index] = {
            date: document.getElementById('editSaleDate').value,
            itemName: document.getElementById('editSaleProduct').value,
            quantity: parseInt(document.getElementById('editSaleQuantity').value),
            price: parseFloat(document.getElementById('editSalePrice').value),
            customerName: document.getElementById('editSaleCustomer').value
        };

        localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
        displaySales();

        const editSalesModal = bootstrap.Modal.getInstance(document.getElementById('editSalesModal'));
        editSalesModal.hide();
    });

    // Delete sale function
    window.deleteSale = (index) => {
        salesRecords.splice(index, 1);
        localStorage.setItem('salesRecords', JSON.stringify(salesRecords));
        displaySales();
    };

    // Initialize
    loadItems();
    displaySales();
});
