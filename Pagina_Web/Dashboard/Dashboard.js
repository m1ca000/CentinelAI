const items = document.querySelectorAll('.upper-bar li');
const blocks = document.querySelectorAll('.block');
let activeBlock = document.querySelector('.block.active');

items.forEach(item => {
    item.addEventListener('click', function() {
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const target = this.getAttribute('data-target');
        const newBlock = document.querySelector(`.${target}`);

        if (activeBlock !== newBlock) {
            const direction = (Array.from(blocks).indexOf(newBlock) < Array.from(blocks).indexOf(activeBlock)) ? 'left' : 'right';
            
            activeBlock.classList.add(`slide-out-${direction}`);
            activeBlock.style.opacity = '0';

            newBlock.style.display = 'block';
            newBlock.classList.add(`slide-in-${direction}`);
            newBlock.style.opacity = '0';

            setTimeout(() => {
                newBlock.classList.remove(`slide-in-${direction}`);
                newBlock.style.opacity = '1';

                activeBlock.classList.remove(`active`, `slide-out-${direction}`);
                activeBlock.style.display = 'none';
                activeBlock.style.opacity = '0';

                activeBlock = newBlock;
                activeBlock.classList.add('active');
            }, 500); // Duration should match the CSS transition time
        }
    });
});
