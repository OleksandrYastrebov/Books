<template>
  <div class="container">
    <div class="description">
      <button class="description__close" @click="close">x</button>
      <p class="description__text"></p>
    </div>
    <form
      class="search-form"
      v-on:submit.prevent="search()"
      @click="goFirstPage()"
    >
      <input
        class="search"
        type="text"
        v-model="newBook"
        placeholder="Search for a book"
      />
      <button>Search</button>
    </form>
    <p class="quote" v-if="!products.length">
      “Think before you speak. Read before you think.” – Fran Lebowitz
    </p>
    <p id="noBookPopup" v-if="!products.length">Sorry there is no such book</p>
    <section class="books-container" v-if="products">
      <div class="book" v-for="product in products" :key="product.title">
        <a
          v-if="product.volumeInfo.description"
          class="show-info"
          @click="showInfo(product)"
        >
          <img class="icon" src="/img/icons/description.svg" alt />
        </a>

        <a class="read" :href="read(product)" target="_blank">
          <img
            class="icon"
            v-if="read(product)"
            src="/img/icons/book.svg"
            alt
          />
        </a>

        <img
          class="book__image"
          :src="
            product.volumeInfo.imageLinks
              ? product.volumeInfo.imageLinks.thumbnail
              : replaceImg
          "
          alt
        />
        <p class="book__title">{{ product.volumeInfo.title }}</p>
        <p>
          {{
            product.volumeInfo.authors ? product.volumeInfo.authors.join() : ""
          }}
        </p>
        <button id="addToShelf" @click="addBook(product.id)">Add</button>
        <a
          v-if="product.saleInfo.buyLink"
          :class="{ book__buy: product.saleInfo.buyLink }"
          :href="product.saleInfo.buyLink"
          target="_blank"
        >
          <img
            class="shop-cart"
            :src="
              product.saleInfo.buyLink ? '/img/icons/shopping-cart.svg' : ''
            "
          />
        </a>
      </div>
    </section>
    <div v-show="showPopupAdd" id="popup_add" class="popup_book-added">
      The book has been added to your Bookshelf
    </div>
    <vue-awesome-paginate
      v-if="AreBooksFetched"
      :total-items="totalPages / 6"
      :items-per-page="6"
      :max-pages-shown="5"
      :current-page="currentPage"
      :on-click="changePages"
    />
  </div>
</template>

<script>
import Methods from "../helpers/Methods.js";

export default {
  data: () => ({
    currentPage: 1,
    totalPages: 0,
    startPageIndex: 0,
    booksPerPage: 8,
    products: [],
    newBook: "",
    books: [],
    replaceImg: "src/img/book.png",
    maxResults: 10,
    clientWidth: 700,
    showPopupAdd: false,
    AreBooksFetched: false,
  }),
  created() {
    (this.showInfo = Methods.showInfo),
      (this.close = Methods.close),
      (this.read = Methods.read);
  },
  mounted() {
    //Making the books grid adaptive
    this.clientWidth = document.body.clientWidth;
    if (this.clientWidth < 790) {
      this.booksPerPage = 6;
    }
    //
    if (localStorage.getItem("books")) {
      try {
        this.books = JSON.parse(localStorage.getItem("books"));
      } catch (e) {
        localStorage.removeItem("books");
      }
    }
  },
  methods: {
    search() {
      this.AreBooksFetched = false;
      this.products = [];
      this.maxResults = this.booksPerPage;
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${this.newBook}&startIndex=${this.startPageIndex}&maxResults=${this.maxResults}`
      )
        .then((response) => response.json())
        .then(
          (result) => (
            (this.totalPages = result.totalItems),
            (this.AreBooksFetched = true),
            (this.products = result.items)
          )
        );
    },
    addBook(item) {
      if (!this.books.includes(item)) {
        this.books.push(item);
      }
      this.saveBooks();
      let y = window.scrollY;
      const popup = document.getElementById("popup_add");
      const height = document.documentElement.clientHeight;
      const width = document.documentElement.clientWidth;
      popup.style.top = Math.round(y) + height / 2 + `px`;

      // 300 is the width of a Popup
      popup.style.left = width / 2 - 300 / 2 + `px`;

      this.showPopupAdd = true;
      setTimeout(() => {
        this.showPopupAdd = false;
      }, 2000);
    },
    saveBooks() {
      let parsedBook = JSON.stringify(this.books);
      localStorage.setItem("books", parsedBook);
    },
    changePages(pageNumber) {
      this.currentPage = pageNumber;
      this.startPageIndex = pageNumber * this.booksPerPage;
      this.search();
    },
    goFirstPage() {
      this.currentPage = 1;
    },
  },
};
</script>

<style lang="scss">
@import "../styles/main.scss";
.pagination-container {
  display: flex;
  column-gap: 10px;
}
.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}
.active-page:hover {
  background-color: #2988c8;
}
</style>
