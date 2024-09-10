const items = document.querySelectorAll('.upper-bar li');
const blocks = document.querySelectorAll('.block');

// Handle menu click
items.forEach(item => {
    item.addEventListener('click', function() {
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        blocks.forEach(block => block.classList.remove('active'));

        const target = this.getAttribute('data-target');
        document.querySelector(`.${target}`).classList.add('active');
    });
});
