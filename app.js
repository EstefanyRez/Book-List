class Book {
	constructor(_title, _author, _isbn){
		this.title = _title
		this.author = _author
		this.isbn = _isbn
	}
}

//UI (User Interface)
class UI {
	static displayBooks(){
		const books = Store.getBooks()

		//UI.addBookToList is a method from UI
		books.forEach(book => UI.addBookTolist(book))
	}

	static addBookTolist(book) {
		const list = document.getElementById('book-list')

		const row = document.createElement('tr')
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`

		list.appendChild(row)
	}

	//This method states that if element contains the 'delete' class in it then remove the parent of its parent
	static deleteBook(el) {
		if (el.classList.contains('delete')){
			el.parentElement.parentElement.remove()
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div')
		div.className = `alert alert-${className}` //className wipe out all classes and uses the one you assign instead
		div.appendChild(document.createTextNode(message))
		const container = document.querySelector('.container')
		const form = document.getElementById('book-form')
		container.insertBefore(div, form)
		//Make it fade away in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000)
	}

	static clearFields() {
		document.getElementById('title').value = ''
		document.getElementById('author').value = ''
		document.getElementById('isbn').value = ''
	}
}

//Store class
//We cannot store objects, so before attempting to store them we gotta convert 'em to strings
class Store {
	static getBooks() {
		let books
		if(localStorage.getItem('books') === null) {
			books = []
		} else {
			books = JSON.parse(localStorage.getItem('books'))
		}

		return books
	}

	static addBook(book) {
		const books = Store.getBooks()

		books.push(book)

		localStorage.setItem('books', JSON.stringify(books))
	}

	//Remove it by isbn because it should be sorta an ID
	static removeBook(isbn) {
		const books = Store.getBooks()

		books.forEach((book, index) =>{
			if(book.isbn === isbn) {
				books.splice(index, 1)
			}
		})

		localStorage.setItem('books', JSON.stringify(books))
	}
}


//As soon as the DOM is loaded display UI method: displayBooks
document.addEventListener('DOMContentLoaded', UI.displayBooks)

document.getElementById('book-form').addEventListener('submit', (e) =>{
	e.preventDefault()

	//To get form values
	const title = document.getElementById('title').value
	const author = document.getElementById('author').value
	const isbn = document.getElementById('isbn').value

	//If button is clicked and one of the three fields is empty, pop up the alert:
	if (title === '' || author === '' || isbn === ''){
		UI.showAlert('Please fill in all the files before continuing', 'danger')
	} else{
		//Instantiate the book
		const book = new Book(title, author, isbn)

		//When submit is clicked execute this method which creates a new row filling in every field
		UI.addBookTolist(book)

		//Add book to local store
		Store.addBook(book)

		//Success Alert
		UI.showAlert('Book added', 'success')

		//When submit is clicked execute this UI method which clear the fields automatically
		UI.clearFields()
	}
})

//Remove a book (a row) using event propagation (and also from local storage)
document.getElementById('book-list').addEventListener('click', e =>{
	//Remove it from the DOM
	UI.deleteBook(e.target)

	//Remove book from local storage by isbn
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent)


	//Remove a book alert
	UI.showAlert('Book removed', 'info')
})
