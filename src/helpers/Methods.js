export default {
  showInfo(product) {
    let text = document.getElementsByClassName("description__text")[0];
    if (product.volumeInfo.description) {
      text.innerText = product.volumeInfo.description;
    } else {
      text.innerText = "There is no description for this book";
    }

    const container = document.getElementsByClassName("description")[0];

    container.style.transform = `translateX(0px)`;

    container.style.position = "fixed";
    container.style.top = `0px`;
    container.style.opacity = 1;
  },
  close() {
    let container = document.getElementsByClassName("description")[0];
    container.style.transform = "translateX(-100vw)";
    container.style.opacity = 0;
  },
  read(product) {
    return product.accessInfo.webReaderLink;
  },
};
