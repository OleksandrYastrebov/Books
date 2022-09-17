<template>
  <div class="about">
    <h1>My Bookshelf</h1>

    <div class="container">
      <div class="description">
        <button class="description__close" @click="close">x</button>
        <p class="description__text"></p>
      </div>

      <section class="books-container">
        <div
          class="book"
          v-for="(product, index) in products"
          :key="product.id"
          :id="`block${index}`"
        >
          <a class="show-info" @click="showInfo(product)">
            <img
              class="icon"
              src="/img/icons/description.svg"
              height="25px"
              alt
            />
          </a>
          <a class="read" :href="read(product)" target="_blank">
            <img class="icon" src="/img/icons/book.svg" height="25px" alt />
          </a>
          <img
            class="book__image"
            :src="
              product.volumeInfo.imageLinks
                ? product.volumeInfo.imageLinks.thumbnail
                : replacedImg
            "
            alt
          />
          <p class="book__title">{{ product.volumeInfo.title }}</p>
          <p>
            {{
              product.volumeInfo.authors
                ? product.volumeInfo.authors.join()
                : ""
            }}
          </p>
          <button class="remove-btn" @click="del(index)">
            <span>remove</span>
          </button>
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

      <vue-awesome-paginate
        v-if="AreBooksFetched"
        :total-items="id.length"
        :items-per-page="booksPerPage"
        :max-pages-shown="5"
        :current-page="currentPage"
        :on-click="changePages"
      />
    </div>
  </div>
</template>

<script>
import Methods from "../helpers/Methods.js";

export default {
  data: () => ({
    AreBooksFetched: false,
    id: JSON.parse(localStorage.getItem("books")),
    products: [],
    page: 1,
    currentPage: 1,
    clientWidth: 700,
    booksPerPage: 8,
    replacedImg: "/img/book.png",
  }),
  created() {
    (this.showInfo = Methods.showInfo),
      (this.close = Methods.close),
      (this.read = Methods.read);
  },
  mounted() {
    this.clientWidth = document.body.clientWidth;
    if (this.clientWidth < 790) {
      this.booksPerPage = 6;
    }
    this.fetching(1);
  },
  methods: {
    changePages(currentPage) {
      this.currentPage = currentPage;
      this.fetching(currentPage);
    },
    async fetching(currentPage) {
      this.AreBooksFetched = false;
      let startIndex = currentPage * this.booksPerPage - this.booksPerPage;
      this.products = [];
      for (let i = startIndex; i < this.booksPerPage + startIndex; i++) {
        if (this.id && this.id[i]) {
          await fetch(
            `https://www.googleapis.com/books/v1/volumes/${this.id[i]}`
          )
            .then((response) => response.json())
            .then((result) => this.products.push(result));
        }
      }
      this.AreBooksFetched = true;
    },
    del(index) {
      this.id.splice(index, 1);
      localStorage.removeItem("books");
      localStorage.setItem("books", JSON.stringify(this.id));
      document.getElementById(`block${index}`).classList.add("none");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/main.scss";
.books-container {
  @media (min-width: 980px) {
    justify-content: start;
    margin-left: 5%;
  }
}
</style>
