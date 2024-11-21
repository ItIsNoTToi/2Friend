// main.js
const postsSection = document.querySelector('.posts');
const newPostForm = document.querySelector('.new-post form');

// Assume you have a function to fetch posts from the server
async function fetchPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();
    return posts;
}

// Assume you have a function to create a new post
async function createPost(content) {
    const response = await fetch('/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    const post = await response.json();
    return post;
}

// Render posts
async function renderPosts() {
    const posts = await fetchPosts();
    const postsHtml = posts.map(post => `
        <article class="post">
            <header>
                <img src="${post.user.profilePicture}" alt="${post.user.name}'s profile picture">
                <p>${post.user.name}</p>
            </header>
            <p>${post.content}</p>
            <footer>
                <p>${post.createdAt}</p>
                <ul>
                    <li><button><i class="fas fa-thumbs-up"></i> Like</button></li>
                    <li><button><i class="fas fa-comment"></i> Comment</button></li>
                    <li><button><i class="fas fa-share"></i> Share</button></li>
                </ul>
            </footer>
        </article>
    `).join('');
    postsSection.innerHTML = postsHtml;
}

// Handle new post form submission
newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = newPostForm.querySelector('textarea').value;
    const post = await createPost(content);
    await renderPosts();
    newPostForm.querySelector('textarea').value = '';
});

// Initialize
renderPosts();
