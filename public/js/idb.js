//HOLD DB CONNECTION
let db;
const request = indexdDB.open('budget_tracker', 1);

//IF THE DATABASE VERSION CHANGES
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
   
};

//SUCCESS
request.onsuccess = function(event) {
    db = event.target.result;

    //ONLINE AVAILABILITY CHECK
    if(navigator.online) {
        uploadTransaction(); //created below
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

//NO internet
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');
    
    transactionObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');

    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plan, */*',
                    'Content-Type' : 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse)
                }

                //another transaction
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const transactionObjectStore = transaction.objectStore('new_transaction');

                transactionObjectStore.clear();
                
                alert('All saved transactions have been submitted!');
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

//app back ONLINE
window.addEventListener('online', uploadTransaction);