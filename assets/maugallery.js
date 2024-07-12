document.addEventListener("DOMContentLoaded", function () {
	var gallery = document.querySelector(".gallery");

	// Call the vanilla JS equivalent of $.fn.mauGallery
	mauGallery(gallery, {
		columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
		lightBox: true,
		lightboxId: "myAwesomeLightbox",
		showTags: true,
		tagsPosition: "top",
	});

	function mauGallery(element, options) {
		var tagsCollection = [];

		// Create row wrapper
		createRowWrapper(element);

		// Create lightbox if enabled
		if (options.lightBox) {
			createLightBox(element, options.lightboxId, options.navigation);
		}

		// Add event listeners
		addEventListeners(options);

		// Process each gallery item
		element.querySelectorAll(".gallery-item").forEach(function (item) {
			responsiveImageItem(item);
			moveItemInRowWrapper(item);
			wrapItemInColumn(item, options.columns);

			var theTag = item.dataset.galleryTag;
			if (
				options.showTags &&
				theTag !== undefined &&
				tagsCollection.indexOf(theTag) === -1
			) {
				tagsCollection.push(theTag);
			}
		});

		// Show tags if enabled
		if (options.showTags) {
			showItemTags(element, options.tagsPosition, tagsCollection);
		}

		// Fade in the gallery
		element.style.display = "block";
	}

	function createRowWrapper(element) {
		if (!element.querySelector(".gallery-items-row")) {
			var rowWrapper = document.createElement("div");
			rowWrapper.classList.add("gallery-items-row", "row");
			element.appendChild(rowWrapper);
		}
	}

	function wrapItemInColumn(element, columns) {
		var columnWrapper = document.createElement("div");
		columnWrapper.classList.add("item-column", "mb-4");

		if (typeof columns === "number") {
			columnWrapper.classList.add(`col-${Math.ceil(12 / columns)}`);
		} else if (typeof columns === "object") {
			if (columns.xs)
				columnWrapper.classList.add(
					`col-${Math.ceil(12 / columns.xs)}`
				);
			if (columns.sm)
				columnWrapper.classList.add(
					`col-sm-${Math.ceil(12 / columns.sm)}`
				);
			if (columns.md)
				columnWrapper.classList.add(
					`col-md-${Math.ceil(12 / columns.md)}`
				);
			if (columns.lg)
				columnWrapper.classList.add(
					`col-lg-${Math.ceil(12 / columns.lg)}`
				);
			if (columns.xl)
				columnWrapper.classList.add(
					`col-xl-${Math.ceil(12 / columns.xl)}`
				);
		} else {
			console.error(
				`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
			);
		}

		element.parentElement.appendChild(columnWrapper);
		columnWrapper.appendChild(element);
	}

	function moveItemInRowWrapper(element) {
		element.parentElement
			.querySelector(".gallery-items-row")
			.appendChild(element);
	}

	function responsiveImageItem(element) {
		if (element.tagName === "IMG") {
			element.classList.add("img-fluid");
		}
	}

	function createLightBox(gallery, lightboxId, navigation) {
		var modalContent = `<div class="modal fade" id="${lightboxId}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        ${
							navigation
								? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>'
								: ""
						}
                        <img class="lightboxImage img-fluid" alt="Content displayed in lightbox">
                        ${
							navigation
								? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>'
								: ""
						}
                    </div>
                </div>
            </div>
        </div>`;
		gallery.insertAdjacentHTML("beforeend", modalContent);
	}

	function showItemTags(gallery, position, tags) {
		var tagItems = `<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">All</span></li>`;
		tags.forEach(function (tag) {
			tagItems += `<li class="nav-item active">
                <span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
		});

		var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

		if (position === "bottom") {
			gallery.insertAdjacentHTML("beforeend", tagsRow);
		} else if (position === "top") {
			gallery.insertAdjacentHTML("afterbegin", tagsRow);
		} else {
			console.error(`Unknown tags position: ${position}`);
		}
	}

	function addEventListeners(options) {
		document.querySelectorAll(".gallery-item").forEach(function (item) {
			item.addEventListener("click", function () {
				if (options.lightBox && item.tagName === "IMG") {
					openLightBox(item, options.lightboxId);
				}
			});
		});

		document
			.querySelector(".gallery")
			.addEventListener("click", function (event) {
				if (event.target.classList.contains("nav-link")) {
					filterByTag(event.target);
				} else if (event.target.classList.contains("mg-prev")) {
					prevImage(options.lightboxId);
				} else if (event.target.classList.contains("mg-next")) {
					nextImage(options.lightboxId);
				}
			});
	}

	function openLightBox(element, lightboxId) {
		document
			.getElementById(lightboxId)
			.querySelector(".lightboxImage")
			.setAttribute("src", element.getAttribute("src"));
		$("#" + lightboxId).modal("toggle");
	}

	function prevImage(lightboxId) {
		var activeImage = document.querySelector(".lightboxImage");
		var activeTag = document.querySelector(".tags-bar .active-tag").dataset
			.imagesToggle;
		var imagesCollection = [];

		if (activeTag === "all") {
			document
				.querySelectorAll(".item-column img")
				.forEach(function (img) {
					imagesCollection.push(img);
				});
		} else {
			document
				.querySelectorAll(".item-column img")
				.forEach(function (img) {
					if (img.dataset.galleryTag === activeTag) {
						imagesCollection.push(img);
					}
				});
		}

		var index = Array.from(imagesCollection).findIndex(function (img) {
			return img.getAttribute("src") === activeImage.getAttribute("src");
		});

		var prev =
			imagesCollection[index - 1] ||
			imagesCollection[imagesCollection.length - 1];
		activeImage.setAttribute("src", prev.getAttribute("src"));
	}

	function nextImage(lightboxId) {
		var activeImage = document.querySelector(".lightboxImage");
		var activeTag = document.querySelector(".tags-bar .active-tag").dataset
			.imagesToggle;
		var imagesCollection = [];

		if (activeTag === "all") {
			document
				.querySelectorAll(".item-column img")
				.forEach(function (img) {
					imagesCollection.push(img);
				});
		} else {
			document
				.querySelectorAll(".item-column img")
				.forEach(function (img) {
					if (img.dataset.galleryTag === activeTag) {
						imagesCollection.push(img);
					}
				});
		}

		var index = Array.from(imagesCollection).findIndex(function (img) {
			return img.getAttribute("src") === activeImage.getAttribute("src");
		});

		var next = imagesCollection[index + 1] || imagesCollection[0];
		activeImage.setAttribute("src", next.getAttribute("src"));
	}

	function filterByTag(clickedTag) {
		if (clickedTag.classList.contains("active-tag")) {
			return;
		}

		document
			.querySelector(".active-tag")
			.classList.remove("active", "active-tag");
		clickedTag.classList.add("active", "active-tag");

		var tag = clickedTag.dataset.imagesToggle;

		document.querySelectorAll(".gallery-item").forEach(function (item) {
			var column = item.closest(".item-column");
			if (tag === "all" || item.dataset.galleryTag === tag) {
				column.style.display = "block";
			} else {
				column.style.display = "none";
			}
		});
	}
});
