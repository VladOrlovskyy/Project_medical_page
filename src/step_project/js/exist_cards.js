function addNoItemsMessage() {
    const cardsContent = document.querySelector(".cards-content");
    const message = `
    <span class="no-items">Жодної картки не додано</span>
    `;
    cardsContent.insertAdjacentHTML("afterbegin", message)
};

function deleteNoItemsMessage() {
    const noItemsMessage = document.querySelector('.no-items');
    if (noItemsMessage) {
        noItemsMessage.remove();
    };
};

export function checkCardsExist() {
    const container = document.querySelector('.cards-content');
    const cardElements = container.querySelectorAll('.card-element');

    if (cardElements.length === 0) {
        addNoItemsMessage()
    }
    else {
        deleteNoItemsMessage()
    }
};