









document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("a[href$='.md']");
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const mdFile = this.getAttribute("href");

            fetch(mdFile)
                .then(response => response.text())
                .then(mdContent => {
                    const htmlContent = marked.parse(mdContent);
                    document.getElementById("result-sheet").innerHTML = htmlContent;
                })
                .catch(error => console.error("Error loading Markdown file:", error));
        });
    });
});
