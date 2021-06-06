const editButtonHandler = async (event) => {
    event.preventDefault();
    const name = document.querySelector('input[name="edit-blog-title"]').value;
    const description = document.querySelector('input[name="edit-blog-body"]').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

        const response = await fetch(`/api/blogs/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert('Failed to update blog');
        }
    
};

document
    .querySelector('.edit-blog-form')
    .addEventListener('submit', editButtonHandler);