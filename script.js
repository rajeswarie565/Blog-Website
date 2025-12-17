// ============================================================
// Main Blog Script
// ------------------------------------------------------------
// Handles:
//  - Navigation between posts
//  - Per‑post comment submission and display
//  - Search/filter for posts
//  - Small UI enhancements (active links, current year)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Cache key DOM elements
  const navButtons = Array.from(document.querySelectorAll(".nav-link"));
  const posts = Array.from(document.querySelectorAll(".blog-post"));
  const postListItems = Array.from(document.querySelectorAll(".post-list li"));
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  // ---------------------- Navigation -------------------------
  /**
   * Show a specific post by ID and update active navigation
   * @param {string} postId - The id of the post to show (e.g. "post-1")
   */
  function showPost(postId) {
    // Toggle visible article
    posts.forEach((post) => {
      post.classList.toggle("active", post.id === postId);
    });

    // Highlight matching nav button
    navButtons.forEach((btn) => {
      const target = btn.getAttribute("data-target");
      btn.classList.toggle("active", target === postId);
    });
  }

  // Clicking a top navigation button
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      showPost(target);
      // Scroll to top of the active post for better UX
      const activePost = document.getElementById(target);
      if (activePost) {
        activePost.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Clicking an item in the left post list
  postListItems.forEach((item) => {
    item.addEventListener("click", () => {
      const postId = item.getAttribute("data-post-id");
      showPost(postId);
      const activePost = document.getElementById(postId);
      if (activePost) {
        activePost.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---------------------- Comments ---------------------------
  /**
   * Render a comment element and append to the list
   * @param {HTMLUListElement} listElement
   * @param {string} author
   * @param {string} message
   */
  function addCommentToList(listElement, author, message) {
    const li = document.createElement("li");
    li.className = "comment";

    const header = document.createElement("div");
    header.className = "comment-header";

    const authorSpan = document.createElement("span");
    authorSpan.className = "comment-author";
    authorSpan.textContent = author || "Anonymous";

    const dateSpan = document.createElement("span");
    dateSpan.className = "comment-date";
    dateSpan.textContent = new Date().toLocaleString();

    header.appendChild(authorSpan);
    header.appendChild(dateSpan);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = message;

    li.appendChild(header);
    li.appendChild(body);
    listElement.prepend(li);
  }

  // Attach submit handlers to all comment forms
  const commentForms = Array.from(document.querySelectorAll(".comment-form"));

  commentForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const postId = form.getAttribute("data-post-id");
      const nameInput = form.querySelector('input[name="name"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      const nameValue = nameInput.value.trim();
      const messageValue = messageInput.value.trim();

      if (!messageValue) {
        // Simple validation: at least comment text is required
        messageInput.focus();
        return;
      }

      const listElement = document.getElementById(`comments-${postId}`);
      if (!listElement) return;

      addCommentToList(listElement, nameValue, messageValue);

      // Clear the form after submitting
      form.reset();
    });
  });

  // ---------------------- Search -----------------------------
  /**
   * Filter posts by a search term across titles and tags.
   * This affects the sidebar list and chooses the first visible post.
   * @param {string} term
   */
  function filterPosts(term) {
    const normalized = term.trim().toLowerCase();

    // If no search term, show all posts and keep current active
    if (!normalized) {
      postListItems.forEach((item) => item.classList.remove("hidden-by-search"));
      return;
    }

    let firstVisibleId = null;

    postListItems.forEach((item) => {
      const postId = item.getAttribute("data-post-id");
      const linkedPost = document.getElementById(postId);
      if (!linkedPost) return;

      const titleText = item.querySelector("h3")?.textContent.toLowerCase() || "";
      const tagText = linkedPost.getAttribute("data-tags")?.toLowerCase() || "";

      const matches = titleText.includes(normalized) || tagText.includes(normalized);

      if (matches) {
        item.classList.remove("hidden-by-search");
        if (!firstVisibleId) {
          firstVisibleId = postId;
        }
      } else {
        item.classList.add("hidden-by-search");
      }
    });

    // If we found a visible post, show it
    if (firstVisibleId) {
      showPost(firstVisibleId);
    }
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      filterPosts(searchInput.value);
    });

    // Live search while typing (optional enhancement)
    searchInput.addEventListener("input", () => {
      filterPosts(searchInput.value);
    });
  }

  // ---------------------- Misc -------------------------------
  // Display current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
});


