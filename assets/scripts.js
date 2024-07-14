document.addEventListener("DOMContentLoaded", () => {
	const buttons = document.querySelectorAll(".container__buttons button");
	const images = document.querySelectorAll(".gallery-item");
	const modal = document.getElementById("modal");
	const modalImg = document.getElementById("modalImg");
	const closeModal = document.querySelector(".close");
	const prevButton = document.querySelector(".prev");
	const nextButton = document.querySelector(".next");
	let currentIndex = 0;

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const filter = button.textContent.toLowerCase();
			images.forEach((image) => {
				if (
					filter === "tous" ||
					image.getAttribute("data-gallery-tag").toLowerCase() ===
						filter
				) {
					image.style.display = "block";
				} else {
					image.style.display = "none";
				}
			});
		});
	});

	images.forEach((image, index) => {
		image.addEventListener("click", () => {
			currentIndex = index;
			openModal(image.src);
		});
	});

	closeModal.addEventListener("click", () => {
		modal.style.display = "none";
	});

	prevButton.addEventListener("click", () => {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		openModal(images[currentIndex].src);
	});

	nextButton.addEventListener("click", () => {
		currentIndex = (currentIndex + 1) % images.length;
		openModal(images[currentIndex].src);
	});

	function openModal(src) {
		modal.style.display = "block";
		modalImg.src = src;
	}

	// Affiche toutes les images au chargement initial
	document
		.querySelector(".container__buttons button[data-filter='Tous']")
		.click();
});
