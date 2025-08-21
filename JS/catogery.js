document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.category a');
    const boxes = document.querySelectorAll('.box');
    const blogs = document.querySelector('.blogs'); // Adjust the selector to match your blogs section

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            categoryLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to the clicked link
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            boxes.forEach(box => {
                if (category === 'all' || box.getAttribute('data-category') === category) {
                    box.style.display = 'block'; // Show matching items
                } else {
                    box.style.display = 'none'; // Hide non-matching items
                }
            });

            // Always show the blogs section
            if (blogs) {
                blogs.style.display = 'block'; // Ensure blogs section is visible
            }
        });
    });
});


