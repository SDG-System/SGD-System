function toggleMenu() {
    const sidebar = document.querySelector(".sidebar")
    const content = document.querySelector(".content")
    const toggleIcon = document.getElementById("toggle-icon")

    sidebar.classList.toggle("collapsed")
    if (sidebar.classList.contains("collapsed")) {
      toggleIcon.classList.replace("bi-list", "bi-x")
      content.style.marginLeft = "80px"
    } else {
      toggleIcon.classList.replace("bi-x", "bi-list")
      content.style.marginLeft = "250px"
    }
  }